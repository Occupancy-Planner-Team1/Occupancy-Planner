package it.designers.OCCUPANCY;

import it.designers.OCCUPANCY.dbtables.Booking;
import it.designers.OCCUPANCY.repository.BookingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class BookingService {
    private BookingRepository bookingRepository;

    @Autowired
    public void setBookingRepository(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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







}
