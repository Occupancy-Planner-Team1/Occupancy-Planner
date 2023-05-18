package service;

import java.time.LocalDate;
import org.json.JSONArray;


public interface ReservationService {
	
	Integer saveReservation(LocalDate date,int dauer, int timeslot,String leaderid, String userid, int stuhlid, int bookingno);
	Integer deleteReservation(int bookingno);
	String deleteReservationLeader(LocalDate date, int timeslot, String leaderid);
	JSONArray getMultipleTimeSlots(LocalDate date, int dauer, int timeslot);
	int recommendBooking(LocalDate date, int dauer, int timeslot, int guests);
	JSONArray timeslotLoad(LocalDate date);
}