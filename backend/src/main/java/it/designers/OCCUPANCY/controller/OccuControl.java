package it.designers.OCCUPANCY.controller;

import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import it.designers.OCCUPANCY.dbtables.Mitarbeiter;
import it.designers.OCCUPANCY.dbtables.Reservation;
import it.designers.OCCUPANCY.repository.MitarbeiterRepository;
import it.designers.OCCUPANCY.repository.ReservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.security.Principal;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class OccuControl {

    private final ReservationRepository reservationRepository;
    private final MitarbeiterRepository mitarbeiterRepository;

    public OccuControl(ReservationRepository reservationRepository, MitarbeiterRepository mitarbeiterRepository) {
        this.reservationRepository = reservationRepository;
        this.mitarbeiterRepository = mitarbeiterRepository;
    }

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
    public ResponseEntity<String >firstLoginInsert(Principal principal){
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        String prename = (String) token.getTokenAttributes().get("given_name");
        String lastname = (String) token.getTokenAttributes().get("family_name");
        String kcid = (String) token.getTokenAttributes().get("sub");

//        Collection<Reservation> custom2 = this.reservationRepository.findBycustom2(ts, datum);
        Collection<Mitarbeiter> m1 = this.mitarbeiterRepository.tryFindUser(kcid);

            Mitarbeiter neuerDulli = new Mitarbeiter(null, prename, lastname, kcid);

            try {
                mitarbeiterRepository.save(neuerDulli);
            } catch (Exception e){}


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


        return ResponseEntity.ok("prename: " + prename + "\nlastname: " + lastname + "\nid: " + kcid);
    }


//    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Reservation>neueReservierung(@RequestBody Reservation r){
//        this.reservationRepository.save(r);
//        return ResponseEntity.ok(r);
//    }

    @GetMapping("/res-all") //spuckt ALLE reservierungen aus
    public ResponseEntity<List<Reservation>> getAllRes() {

        return ResponseEntity.ok(this.reservationRepository.findAll());
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












