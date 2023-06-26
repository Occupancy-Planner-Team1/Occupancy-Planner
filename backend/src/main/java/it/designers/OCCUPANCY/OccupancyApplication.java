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

		

		Chair chair0 = new Chair();
		chair0.setChairName("chair_1");
		Chair chair1 = new Chair();
		chair1.setChairName("chair_2");
		Chair chair2 = new Chair();
		chair2.setChairName("chair_3");
		Chair chair3 = new Chair();
		chair3.setChairName("chair_4");
		Chair chair4 = new Chair();
		chair4.setChairName("chair_5");
		Chair chair5 = new Chair();
		chair5.setChairName("chair_6");
		Chair chair6 = new Chair();
		chair6.setChairName("chair_7");
		Chair chair7 = new Chair();
		chair7.setChairName("chair_8");
		Chair chair8 = new Chair();
		chair8.setChairName("chair_9");
		Chair chair9 = new Chair();
		chair9.setChairName("chair_10");
		Chair chair10 = new Chair();
		chair10.setChairName("chair_11");
		Chair chair11 = new Chair();
		chair11.setChairName("chair_12");
		Chair chair12 = new Chair();
		chair12.setChairName("chair_13");
		Chair chair13 = new Chair();
		chair13.setChairName("chair_14");
		Chair chair14 = new Chair();
		chair14.setChairName("chair_15");
		Chair chair15 = new Chair();
		chair15.setChairName("chair_16");
		Chair chair16 = new Chair();
		chair16.setChairName("chair_17");
		Chair chair17 = new Chair();
		chair17.setChairName("chair_18");
		Chair chair18 = new Chair();
		chair18.setChairName("chair_19");
		Chair chair19 = new Chair();
		chair19.setChairName("chair_20");
		Chair chair20 = new Chair();
		chair20.setChairName("chair_21");
		Chair chair21 = new Chair();
		chair21.setChairName("chair_22");
		Chair chair22 = new Chair();
		chair22.setChairName("chair_23");
		Chair chair23 = new Chair();
		chair23.setChairName("chair_24");
		Chair chair24 = new Chair();
		chair24.setChairName("chair_25");
		Chair chair25 = new Chair();
		chair25.setChairName("chair_26");
		Chair chair26 = new Chair();
		chair26.setChairName("chair_27");
		Chair chair27 = new Chair();
		chair27.setChairName("chair_28");
		Chair chair28 = new Chair();
		chair28.setChairName("chair_29");
		Chair chair29 = new Chair();
		chair29.setChairName("chair_30");
		Chair chair30 = new Chair();
		chair30.setChairName("chair_31");
		Chair chair31 = new Chair();
		chair31.setChairName("chair_32");

		Reservation neuesReservation0 = new Reservation();
		Reservation neuesReservation1 = new Reservation();
		Reservation neuesReservation2 = new Reservation();
		Reservation neuesReservation3 = new Reservation();
		Reservation neuesReservation4 = new Reservation();
		Reservation neuesReservation5 = new Reservation();
		Reservation neuesReservation6 = new Reservation();
		Reservation neuesReservation7 = new Reservation();
		Reservation neuesReservation8 = new Reservation();
		Reservation neuesReservation9 = new Reservation();
		Reservation neuesReservation10 = new Reservation();
		Reservation neuesReservation11 = new Reservation();
		Reservation neuesReservation12 = new Reservation();
		Reservation neuesReservation13 = new Reservation();
		Reservation neuesReservation14 = new Reservation();
		Reservation neuesReservation15 = new Reservation();
		Reservation neuesReservation16 = new Reservation();
		Reservation neuesReservation17 = new Reservation();
		Reservation neuesReservation18 = new Reservation();
		Reservation neuesReservation19 = new Reservation();
		Reservation neuesReservation20 = new Reservation();
		Reservation neuesReservation21 = new Reservation();
		Reservation neuesReservation22 = new Reservation();
		Reservation neuesReservation23 = new Reservation();
		Reservation neuesReservation24 = new Reservation();
		Reservation neuesReservation25 = new Reservation();
		Reservation neuesReservation26 = new Reservation();
		Reservation neuesReservation27 = new Reservation();
		Reservation neuesReservation28 = new Reservation();
		Reservation neuesReservation29 = new Reservation();
		Reservation neuesReservation30 = new Reservation();
		Reservation neuesReservation31 = new Reservation();

		Booking neuesBooking = new Booking();

		neuesReservation0.setChair(chair0);
		neuesReservation1.setChair(chair1);
		neuesReservation2.setChair(chair2);
		neuesReservation3.setChair(chair3);
		neuesReservation4.setChair(chair4);
		neuesReservation5.setChair(chair5);
		neuesReservation6.setChair(chair6);
		neuesReservation7.setChair(chair7);
		neuesReservation8.setChair(chair8);
		neuesReservation9.setChair(chair9);
		neuesReservation10.setChair(chair10);
		neuesReservation11.setChair(chair11);
		neuesReservation12.setChair(chair12);
		neuesReservation13.setChair(chair13);
		neuesReservation14.setChair(chair14);
		neuesReservation15.setChair(chair15);
		neuesReservation16.setChair(chair16);
		neuesReservation17.setChair(chair17);
		neuesReservation18.setChair(chair18);
		neuesReservation19.setChair(chair19);
		neuesReservation20.setChair(chair20);
		neuesReservation21.setChair(chair21);
		neuesReservation22.setChair(chair22);
		neuesReservation23.setChair(chair23);
		neuesReservation24.setChair(chair24);
		neuesReservation25.setChair(chair25);
		neuesReservation26.setChair(chair26);
		neuesReservation27.setChair(chair27);
		neuesReservation28.setChair(chair28);
		neuesReservation29.setChair(chair29);
		neuesReservation30.setChair(chair30);
		neuesReservation31.setChair(chair31);

		neuesReservation1.setStuhlsitzer(UUID.randomUUID());
		neuesReservation2.setStuhlsitzer(UUID.randomUUID());


		neuesBooking.setDatum(LocalDate.now());
		neuesBooking.setBucher(UUID.randomUUID());
		neuesBooking.setTimeslot(1);

		//neuesReservation.setBooking(neuesBooking);

		neuesBooking.getReservations().add(neuesReservation0);
		neuesBooking.getReservations().add(neuesReservation1);
		neuesBooking.getReservations().add(neuesReservation2);
		neuesBooking.getReservations().add(neuesReservation3);
		neuesBooking.getReservations().add(neuesReservation4);
		neuesBooking.getReservations().add(neuesReservation5);
		neuesBooking.getReservations().add(neuesReservation6);
		neuesBooking.getReservations().add(neuesReservation7);
		neuesBooking.getReservations().add(neuesReservation8);
		neuesBooking.getReservations().add(neuesReservation9);
		neuesBooking.getReservations().add(neuesReservation10);
		neuesBooking.getReservations().add(neuesReservation11);
		neuesBooking.getReservations().add(neuesReservation12);
		neuesBooking.getReservations().add(neuesReservation13);
		neuesBooking.getReservations().add(neuesReservation14);
		neuesBooking.getReservations().add(neuesReservation15);
		neuesBooking.getReservations().add(neuesReservation16);
		neuesBooking.getReservations().add(neuesReservation17);
		neuesBooking.getReservations().add(neuesReservation18);
		neuesBooking.getReservations().add(neuesReservation19);
		neuesBooking.getReservations().add(neuesReservation20);
		neuesBooking.getReservations().add(neuesReservation21);
		neuesBooking.getReservations().add(neuesReservation22);
		neuesBooking.getReservations().add(neuesReservation23);
		neuesBooking.getReservations().add(neuesReservation24);
		neuesBooking.getReservations().add(neuesReservation25);
		neuesBooking.getReservations().add(neuesReservation26);
		neuesBooking.getReservations().add(neuesReservation27);
		neuesBooking.getReservations().add(neuesReservation28);
		neuesBooking.getReservations().add(neuesReservation29);
		neuesBooking.getReservations().add(neuesReservation30);
		neuesBooking.getReservations().add(neuesReservation31);
		/*
		service1.save(neuesBooking);
		*/

	}
}
