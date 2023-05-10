package service;

import java.time.LocalDate;
import java.util.List;

import data.Reservation;

public interface ReservationService {
	
	Integer saveReservation(LocalDate date, String timeslot, String userid, int stuhlid, int bookingno);
	Integer deleteReservation(int bookingno, String timeslot);
	List<Integer> findFree(LocalDate date, String timeslot);
	double timeslotLoad(LocalDate date, String timeslot);
}
