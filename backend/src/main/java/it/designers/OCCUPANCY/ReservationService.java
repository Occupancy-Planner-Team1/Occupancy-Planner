package it.designers.OCCUPANCY;

import it.designers.OCCUPANCY.dbtables.Reservation;
import it.designers.OCCUPANCY.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ReservationService {
    private ReservationRepository reservationRepository;
    //CRUD Create Read Update und Delete
    //im Service werden die Exceptions gehandelt
    //Bei Bedarf gibt es hier neue Exceptions
    @Autowired
    public void setReservationRepository(ReservationRepository reservationRepository) { // Eine Dependencyinjection: dass JPA dieses Repository injecten kann
        this.reservationRepository = reservationRepository;
    }

    //save -> einzelnes Element Speichern Create + Update
    public void save(Reservation reservation){
        this.reservationRepository.save(reservation);
    }

    //get all -> Liste mit allem
    public List<Reservation> getAll(){
        return this.reservationRepository.findAll();
    }

    //get einzelnes Element Holen
    public Reservation get(Long id){
        Optional<Reservation> byId = this.reservationRepository.findById(id);
        return byId.orElseThrow(); // wenn es das ding nicht gibt fliegt eine exception -> im Controller abfangen!
    }
    //delete -> einzelnes Element löschen
    public void delete(Reservation reservation){
        this.reservationRepository.delete(reservation); //hier kann ein Fehler entstehen -> Controller abfangen Try Catch
    }

    public void deleteById(Long id){
        Reservation byId = this.reservationRepository.findById(id).get();
        this.reservationRepository.delete(byId);
    }
}
