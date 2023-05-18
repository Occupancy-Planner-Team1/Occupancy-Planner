package it.designers.OCCUPANCY.repository;


import it.designers.OCCUPANCY.dbtables.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r.id FROM Reservation r ORDER by r.id DESC LIMIT 1")
    Integer lastChange();

    @Query("SELECT r FROM Reservation r WHERE r.timeslot = :ts")
    Collection<Reservation> findBycustom1(String ts);

    @Query("SELECT r FROM Reservation r WHERE (r.timeslot =:ts and r.datum =:datum)")
    Collection<Reservation> findBycustom2(String ts, String datum);
    
    @Query(value="SELECT chairid FROM Reservation WHERE date=:date AND timeslot=:timeslot", nativeQuery=true)
	List <Long> findTaken(@Param("date")String date, @Param("timeslot")String timeslot);
    
    @Query(value="SELECT chairid FROM Reservation WHERE date=:date", nativeQuery=true)
    List <Long> findTakenByDate(@Param("date")String date);
    
    @Query(value="SELECT leaderid FROM Reservation WHERE chairid=:chairid AND timeslot=:timeslot", nativeQuery=true)
	String findLeaderId(@Param("chairid")Long chairid, @Param ("timeslot")String timeslot);
    
    @Query(value="SELECT id FROM Reservation WHERE bookingid=:bookingid", nativeQuery=true)
	List<Long> findByBooking(@Param("bookingid") String bookingid);
    
    @Query(value="SELECT id FROM Reservation WHERE leaderid=:leaderid", nativeQuery=true)
    Long findByLeader(@Param("leaderid")String leaderid);


    // Now we can use JpaRepository’s methods: save(), findOne(), findById(), findAll(), count(), delete(), deleteById()… without implementing these methods.
    // AAABER: findByCustom muss nooch im ReservationController definiert werden
}
