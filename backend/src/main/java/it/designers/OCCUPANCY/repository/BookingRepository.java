package it.designers.OCCUPANCY.repository;

import it.designers.OCCUPANCY.dbtables.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    //WARNING------------------ maybe Fehler hier
    @Query(value="SELECT b FROM Booking b WHERE b.datum=:d")
    List<Booking> findByDatum(LocalDate d);
    
    @Query(value="SELECT id FROM Booking WHERE datum<:date", nativeQuery=true)
    List<Long> findByExpired(LocalDate date);
    
   /* @Query(value="DELETE FROM Booking WHERE datum<:date", nativeQuery=true)
    void deleteExpired(LocalDate date);
    */
    
   

//    @Query("SELECT r FROM Reservation r WHERE r.timeslot = :ts")
//    Collection<Reservation> findBycustom1(String ts);


}
