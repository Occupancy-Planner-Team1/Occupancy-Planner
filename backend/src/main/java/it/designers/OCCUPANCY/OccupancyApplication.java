package it.designers.OCCUPANCY;

import it.designers.OCCUPANCY.dbtables.Booking;
import it.designers.OCCUPANCY.dbtables.Chair;
import it.designers.OCCUPANCY.dbtables.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@SpringBootApplication
public class OccupancyApplication implements CommandLineRunner {
	@Autowired
	BookingService service1;
	public static void main(String[] args) {
		SpringApplication.run(OccupancyApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		//System.out.println("stinker");
		//List<Reservation> all = service1.getAll();


		Chair chair = new Chair();
		Chair chair1 = new Chair();
		Chair chair2 = new Chair();

		Reservation neuesReservation1 = new Reservation();
		Reservation neuesReservation2 = new Reservation();
		Booking neuesBooking = new Booking();

		neuesReservation1.setChair(chair);
		neuesReservation2.setChair(chair2);

		neuesReservation1.setStuhlsitzer(UUID.randomUUID());
		neuesReservation2.setStuhlsitzer(UUID.randomUUID());


		neuesBooking.setDatum(LocalDate.now());
		neuesBooking.setBucher(UUID.randomUUID());
		neuesBooking.setTimeslot(1);

		//neuesReservation.setBooking(neuesBooking);

		neuesBooking.getReservations().add(neuesReservation1);
		neuesBooking.getReservations().add(neuesReservation2);

		service1.save(neuesBooking);
	}
}
