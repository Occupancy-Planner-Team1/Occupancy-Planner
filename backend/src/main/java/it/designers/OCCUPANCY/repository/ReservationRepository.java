package it.designers.OCCUPANCY.repository;


import it.designers.OCCUPANCY.dbtables.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r.id FROM Reservation r ORDER by r.id DESC LIMIT 1")
    Integer lastChange();

    @Query("SELECT r FROM Reservation r WHERE r.timeslot = :ts")
    Collection<Reservation> findBycustom1(String ts);

    @Query("SELECT r FROM Reservation r WHERE (r.timeslot =:ts and r.datum =:datum)")
    Collection<Reservation> findBycustom2(String ts, String datum);


    // Now we can use JpaRepository’s methods: save(), findOne(), findById(), findAll(), count(), delete(), deleteById()… without implementing these methods.
    // AAABER: findByCustom muss nooch im ReservationController definiert werden
}
