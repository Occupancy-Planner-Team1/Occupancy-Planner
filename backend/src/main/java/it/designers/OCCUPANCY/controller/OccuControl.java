package it.designers.OCCUPANCY.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.JsonNode;
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
//   @GetMapping("/res/{date}/{ts-start}/{ts-duration}") gibt json mit belegung zurück

//   @GetMapping("/resconfirm") gibt die doppelbuchungen zurück
//   @GetMapping("/res/del/{date}/{ts}/{leaderid}") löscht reservierung anhand datum timeslot leaderid
//   @GetMapping("/res/del-booking/{bookingid}") löscht reservierung(en) anhand bookingid
//   @GetMapping("/res/del-yesterday/") löscht reservierung(en) die vorbei sind
//   @GetMapping("/res/day/{date}") gibt json mit allen plätzen an einem tag zurück




    @GetMapping("/anonymous")
//    public ResponseEntity<String> getAnonymous(@RequestBody int bla) {
//        return ResponseEntity.ok(String.format("Hello Anonymous %s",bla));
//    }
    public ResponseEntity<String> getAnonymous() {
        return ResponseEntity.ok("Hello Anonymous");
    }

    @GetMapping("/anonymous/{bla}") // TESTING only
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





//        Collection<Reservation> custom2 = this.reservationRepository.findBycustom2(ts, datum);
//          Optional<Mitarbeiter> m1 = this.mitarbeiterRepository.tryFindUser(kcid);
//
//            Mitarbeiter neuerDulli = new Mitarbeiter(null, prename, lastname, kcid);
//
//            try {
//                mitarbeiterRepository.save(neuerDulli);
//            } catch (Exception e){}
//        HttpResponse<JsonNode> response;
//        Unirest.setTimeouts(0, 0);
//        try {
//            response = (HttpResponse<JsonNode>) Unirest.post("http://localhost:8069/realms/OCCUPANCY/protocol/openid-connect/token")
//                    .header("Content-Type", "application/x-www-form-urlencoded")
//                    .header("Authorization", "Basic b2NjdXBhbmN5Y2xpZW50Ok50N05XTTNOTWFOSndZV2xMS053bkh4T1pIMUhWTDY2")
//                    .field("grant_type", "client_credentials")
//                    .asJson();

//        } catch (UnirestException e) {
//            throw new RuntimeException(e);
//        }


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
//    @GetMapping("/user")
//    public ResponseEntity<String> getUser(Principal principal) {
//        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
//        String userName = (String) token.getTokenAttributes().get("name");
//        String userEmail = (String) token.getTokenAttributes().get("email");
//        return ResponseEntity.ok("Hello User \nUser Name : " + userName + "\nUser Email : " + userEmail);
//    }

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











