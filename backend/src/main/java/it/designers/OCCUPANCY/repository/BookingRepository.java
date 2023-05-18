package it.designers.OCCUPANCY.repository;

import it.designers.OCCUPANCY.dbtables.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {


}
