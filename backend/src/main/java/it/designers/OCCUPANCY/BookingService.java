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
import java.util.UUID;

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
    public void deleteById(long id){
        Booking bookingOfId = this.bookingRepository.findById(id).get();
        this.delete(bookingOfId);
    }

    //also wenn du hier die letzte buchung zurückgibst brauchst du keine liste sondern nur eine buchung
    //Re: man braucht ja eig nur die id ?! nicht die ganze Buchung.
    public Long lastChange(){
        Booking lastBooking = this.bookingRepository.findAll(Sort.by(Sort.Direction.DESC,"id")).get(0);
        Long lastId = lastBooking.getId();
        return lastId;
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
    	this.bookingRepository.deleteAllInBatch(this.bookingRepository.getExpired(date));
    }


    public List <Booking> getAllFromUser(UUID id){
        return this.bookingRepository.findAllByUserId(id);
    }
    






}
