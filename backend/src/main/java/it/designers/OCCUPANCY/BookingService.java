package it.designers.OCCUPANCY;

import it.designers.OCCUPANCY.dbtables.Booking;
import it.designers.OCCUPANCY.repository.BookingRepository;
import it.designers.OCCUPANCY.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class BookingService {
    private BookingRepository bookingRepository;
    private ReservationRepository resRepo;

    @Autowired
    public void setBookingRepository(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    //ich glaube hier solltest du kein extra löschen implementieren, sondern das löschen von weiter unten benutzen :) löschen sollte entweder nicht oder zur bestätigung das gelöschte objekt oder eine http status zurückgeben
    public String deleteById(long id){
        if(this.bookingRepository.findById(id).isPresent()){
            this.bookingRepository.deleteById(id);
            return "Booking with id " + id + " was Deleted";
        }
        return "Couldn't find or delete Booking with id " + id;
    }

    //also wenn du hier die letzte buchung zurückgibst brauchst du keine liste sondern nur eine buchung
    public List<Booking> lastChange(){
        return this.bookingRepository.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    //save -> einzelnes Element Speichern Create + Update
    public void save(Booking booking){
        this.bookingRepository.save(booking);
    }

    //get all -> Liste mit allem
    public List<Booking> getAll(){
        return this.bookingRepository.findAll();
    }

    //get all per day
    public List<Booking> getAllPerDay(LocalDate d){
        List<Booking> anEinemTag = this.bookingRepository.findByDatum(d);
        return anEinemTag;
    }

    //get einzelnes Element Holen
    public Booking get(Long id){
        Optional<Booking> byId = this.bookingRepository.findById(id);
        return byId.orElseThrow(); // wenn es das ding nicht gibt fliegt eine exception -> im Controller abfangen!
    }
    //delete -> einzelnes Element löschen
    public void delete(Booking booking){
        this.bookingRepository.delete(booking); //hier kann ein Fehler entstehen -> Controller abfangen Try Catch
    }
    
    public void deleteExpired(LocalDate date) {
    	this.bookingRepository.deleteAllByIdInBatch(bookingRepository.findByExpired(date)); //Delete by Id anstatt SQL DELETE
    	//this.bookingRepository.deleteExpired(date); das geht auch aber bei der oberen könnte man bspw. die gelöschten ids zurückgeben
    }
   
    






}
