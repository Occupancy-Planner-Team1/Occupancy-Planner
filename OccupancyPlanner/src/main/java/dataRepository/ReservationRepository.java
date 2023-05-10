package dataRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import data.Chair;
import data.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
	@Query(value="SELECT * FROM reservation WHERE id=:id",nativeQuery=true)
	Reservation findById(@Param("id")int id);
	
	@Query(value="SELECT id FROM reservation WHERE bookingid=:bookingid AND timeslot=:timeslot", nativeQuery=true)
	List<Integer> findByBookingAndTime(@Param("bookingid") int bookingid, @Param("timeslot") String timeslot);
	
	@Query(value="SELECT chair_id FROM reservation WHERE date=:date AND timeslot=:timeslot", nativeQuery=true)
	List <Integer> findTaken(@Param("date")LocalDate date, @Param("timeslot")String timeslot);
	
}
