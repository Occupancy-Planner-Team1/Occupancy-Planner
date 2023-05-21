package it.designers.OCCUPANCY.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.exceptions.UnirestException;
import it.designers.OCCUPANCY.BookingService;
import it.designers.OCCUPANCY.dbtables.Booking;

import it.designers.OCCUPANCY.dbtables.Reservation;
import it.designers.OCCUPANCY.security.KeycloakServiceUser;
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

     private final ReservationService resService;
     private final BookingService bookingService;

    public OccuControl(ReservationService resService, BookingService bookingService) { // Dependencyinjection von Spring/ JPA bei Bedarf -> Also ich Konsumiere meine Services
        this.resService=resService;
        this.bookingService = bookingService;
    }
    
//    @GetMapping("res/{date}/{timeslot}/{dauer}")
//	public ResponseEntity getMultipleTimeSlots(@PathVariable("date") String stringDate, @PathVariable("dauer") int dauer, @PathVariable("timeslot") int timeslot) {
//		LocalDate date=LocalDate.parse(stringDate);
//		return ResponseEntity.ok(this.resService.getMultipleTimeSlots(date, dauer, timeslot).toString());
//	}
//
//    @DeleteMapping("res/del-booking/{bookingNo}")
//	public ResponseEntity deleteReservationByBooking(@PathVariable("bookingNo") int bookingNo) {
//		if(resService.deleteReservation(bookingNo)!=null) {
//			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation deleted");
//		}
//		return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Reservation doesnt exist");
//
//	}

    /*@PutMapping("book/{date}/{dauer}/{timeslot}/{leaderid}/{userid}/{stuhlId}/{bookingNo}")
	public ResponseEntity setReservation(@PathVariable("date")String stringDate,@PathVariable("dauer")int dauer, @PathVariable("timeslot") int timeslot,@PathVariable("leaderid") String leaderid, @PathVariable("userid") String userid, @PathVariable("stuhlId") int chairId, @PathVariable("bookingNo") int booking) {
		
		LocalDate date=LocalDate.parse(stringDate);
		
		if(chairId<0 || chairId>32) {
			return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Invalid chair index");
		}
		if(resService.saveReservation(date, dauer, timeslot, leaderid, userid, chairId, booking)!=null){
			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation accepted");
		}
		return ResponseEntity.status(HttpStatus.SC_FORBIDDEN).body("Chair already reserved");
		
	}*/
    


//--------------------------- TO DO -----------------------
//   @GetMapping("/doppelbuchung") gibt die doppelbuchungen zurück
//   @GetMapping("/res/del-yesterday/") löscht reservierung(en) die vorbei sind


//--------------------------- TO BE EXAMINED LUL -----------------------
//   @GetMapping("/res/del-booking/{bookingid}") löscht reservierung(en) anhand bookingid
//    @GetMapping("/last-change")
//    public Integer lastChange(){
//        return this.reservationRepository.lastChange();
//    }

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

    @GetMapping("/last-change")
    public ResponseEntity<Long> lastChange(){
        List<Booking> bookings = this.bookingService.lastChange();
        Long lastId = bookings.get(0).getId();
        return ResponseEntity.ok(lastId);
    }

    @GetMapping("res/del-booking/{bookingid}")
    public ResponseEntity<String> deletebyId(@PathVariable long bookingid){
        return ResponseEntity.ok(this.bookingService.deleteById(bookingid));
    }



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

    @GetMapping("/verify") // trägt die keycloak id in eine extra datenbank ein obsolet wenn keycloak api mit serviceuser funktioniert
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

        return ResponseEntity.ok(group_members);

        //return ResponseEntity.ok("prename: " + prename + "\nlastname: " + lastname + "\nid: " + kcid);
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


}













//------------------------RESERVIERUNG EINTRAGEN------------------------
//    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Reservation>neueReservierung(@RequestBody Reservation r){
//        this.reservationRepository.save(r);
//        return ResponseEntity.ok(r);
//    }



//    @GetMapping("/{ts}/{datum}")    //Display Status
//    public ResponseEntity<Collection<Reservation>>getAllReservationsPerSlotDatum(@PathVariable String ts, @PathVariable String datum){
//        Collection<Reservation> custom2 = this.reservationRepository.findBycustom2(ts, datum);
//        return ResponseEntity.ok(custom2);
//    }


//    @GetMapping("/last-change")
//    public Integer lastChange(){
//        return this.reservationRepository.lastChange();
//    }

// Beispiel mit datenabrufen:

/*public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId)
        throws ResourceNotFoundException {
    Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));
    return ResponseEntity.ok().body(employee);
}
*/












