package it.designers.OCCUPANCY.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.exceptions.UnirestException;
import it.designers.OCCUPANCY.BookingService;
import it.designers.OCCUPANCY.dbtables.Booking;

import it.designers.OCCUPANCY.dbtables.Reservation;
import it.designers.OCCUPANCY.security.KeycloakServiceUser;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import it.designers.OCCUPANCY.ReservationService;

import java.awt.print.Book;
import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

// Der Controller interagiert mit Services und die Services haben die @Transactional Annotation und agieren mit den Repositories
@RestController
@RequestMapping("/auth")
public class OccuControl {

     //private final ReservationService resService; //wird momentan nicht mehr benötigt da reservierung von booking gemanaged wird
     private final BookingService bookingService;

    public OccuControl(BookingService bookingService) { // Dependencyinjection von Spring/ JPA bei Bedarf -> Also ich Konsumiere meine Services
        //this.resService=resService;
        this.bookingService = bookingService;
   
    }
    




 // Delete yesterday wird nie genutzt, muss auf 1,2,3 Monate geändert werden
    @DeleteMapping("/res/del-yesterday")
    public ResponseEntity deleteExpired() {
    	
    	LocalDate dateNow=LocalDate.now();
    	
    	try {
    		this.bookingService.deleteExpired(dateNow);
    		return ResponseEntity.status(HttpStatus.OK).body("Expired bookings deleted");
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    	}
  }


    @GetMapping("/last-change") // nice tut aber den try catch von emir nehmen ;)
    public ResponseEntity lastChange(){
        try {
            Long lastId = this.bookingService.lastChange();
            return ResponseEntity.status(HttpStatus.OK).body(lastId);
        }
        catch(Exception e) {
            //Not Found warscheinlich nicht ganz passend.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
        }
    }

    //@DeleteMapping fürs löschen nutzen! Rechte: wenn bucher = token.uid
    @DeleteMapping("res/del-booking/{bookingid}") // kommentar: delete sollte keinen string zurückgeben! void oder <Booking> und exception: abfangen, dass eintrag nicht vorhanden
    public ResponseEntity deletebyId(@PathVariable long bookingid,Principal principal){
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        //ist sub richtig als uuid vom token?
        UUID tokenOwner = UUID.fromString((String) token.getTokenAttributes().get("sub"));
        //tokenOwner = UUID.fromString("eb98da0e-a15d-416f-a4ba-fd42c6697e33");

        if(tokenOwner.equals(this.bookingService.get(bookingid).getBucher())){
            try {
                this.bookingService.deleteById(bookingid);
                return ResponseEntity.status(HttpStatus.OK).body(bookingid);
            }
            catch(Exception e) {
                //Not Found warscheinlich nicht ganz passend.
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sorry you can only Delete your own Bookings. " + tokenOwner + " " +this.bookingService.get(bookingid).getBucher() );
    }

//noch ein delete für reservierungen wenn bucher != stuhlnutzerid und stuhlnutzerid = token.uuid sollte der reservation service machen




    // TESTING only
    @GetMapping("/anonymous")
    public ResponseEntity<String> getAnonymous() {
        return ResponseEntity.ok("Hello Anonymous");
    }

    // TESTING only
    @GetMapping("/anonymous/{bla}")
    public ResponseEntity<String> getAnonymous1(@PathVariable("bla") int bla) {
        return ResponseEntity.ok(String.format("Hello Anonymous %s",bla));
    }

    @GetMapping("/verify") // zum testen: liest token daten aus und service user wird getestet
    public ResponseEntity<String >firstLoginInsert(Principal principal) throws UnirestException, JsonProcessingException {
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        String prename = (String) token.getTokenAttributes().get("given_name");
        String lastname = (String) token.getTokenAttributes().get("family_name");
        UUID kcid = UUID.fromString((String) token.getTokenAttributes().get("sub"));
        //UUID.fromString();

        KeycloakServiceUser su = new KeycloakServiceUser();
        String access_token = su.get_access_token();
        String group_members = su.get_group_members(access_token, "13733942-ab89-46cc-b270-c5618aa70cbf");

        System.out.println(group_members);

        //return ResponseEntity.ok(group_members);

        return ResponseEntity.ok("prename: " + prename + "\nlastname: " + lastname + "\nid: " + kcid);
    }

    @PutMapping(value = "/res/",consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Booking>neueBuchung(@RequestBody Booking b){
        this.bookingService.save(b);
        return ResponseEntity.ok(b);
    }

    @GetMapping("/res-all") //spuckt ALLE reservierungen aus
    public ResponseEntity<List<Booking>> getAllRes() {
        return ResponseEntity.ok(this.bookingService.getAll());
    }

    @GetMapping("/res-day/{d}") //spuckt ALLE reservierungen von einem tag aus -> ind d muss Datum: 2023-05-18
    public ResponseEntity<List<Booking>> getAllResPerDay(@PathVariable LocalDate d) {
        return ResponseEntity.ok(this.bookingService.getAllPerDay(d));
    }
    
    //für erste ReservationPage recommended timeslot/timeframe
    @GetMapping("/res-all/user/{userid}")
    public ResponseEntity<List<Booking>> getAllResUser(@PathVariable("userid") UUID id, Principal principal) throws JsonProcessingException, UnirestException{
    	try {
    		return ResponseEntity.status(HttpStatus.OK).body(this.bookingService.getAllFromUser(id));
    	}catch(Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    	}
    	
    }
    
    
    @GetMapping("/res-username/{userid}") //username beim klicken auf Stuhl zurückgeben
    public ResponseEntity<String> getUserName(@PathVariable("userid") UUID id, Principal principal) throws JsonProcessingException, UnirestException {
    	
    	KeycloakServiceUser su = new KeycloakServiceUser(); 
    	
    	String access_token = su.get_access_token();
    	try {
    	String userName=su.get_user_name(access_token, id.toString()); 
		return ResponseEntity.ok(userName);
    	}catch(Exception e) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid UserID");
    	}
    	
    }

}




//   @GetMapping("/doppelbuchung") gibt die doppelbuchungen zurück

    /*@GetMapping("/doppelbuchung")
    public ResponseEntity<String> doppelbuchung(){
        List<Booking> allBookings = this.bookingService.getAll();
        List<Reservation> reservations = new ArrayList<>();
        for (Booking b: allBookings) {
            for (Reservation r:b.getReservations()) {
                reservations.add(r);
            }
        }

        for(int i=0; i<reservations.size();i++){
            for(int j=0;j<reservations.size();j++){
                if(reservations.get(i)==reservations.get(j)){
                    System.out.println(reservations.get(i).getId());
                    System.out.println(reservations.get(j).getId());
                }
            }
        }

        List<Reservation> res = this.resService.getAll();
        System.out.println(this.bookingService.getAll().get(0).getReservations());
        return ResponseEntity.ok("test");
    }*/

    /*@GetMapping("/doppelbuchung")
    public ResponseEntity<List<Reservation>> getDoppelBuchung(){
         Logik: Wenn ein stuhlsitzer mehrere reservation_ids hat, ist er bei mehreren Buchungen eingetragen.
         Überprüfung ob doppelbuchung: Reservation_ids(primary key Booking table) von einem stuhlsitzer nehmen und im Booking Table die Timeslots vergleichen.-->
         Wenn für 2 Verschiedene ids der gleiche Timeslot eingetragen ist==> Doppelbuchung. Umsetzung schwer.
    }*/


//    @DeleteMapping("res/del-booking/{bookingNo}") // bookingno ist eigentlich die bookingid und ist ein long
//	public ResponseEntity deleteReservationByBooking(@PathVariable("bookingNo") int bookingNo) {
//		if(resService.deleteReservation(bookingNo)!=null) {
//			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation deleted");
//		}
//		return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Reservation doesnt exist");
//
//	}











