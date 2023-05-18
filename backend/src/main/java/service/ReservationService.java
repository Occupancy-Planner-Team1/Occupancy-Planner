package service;

import java.time.LocalDate;
import org.json.JSONArray;


public interface ReservationService {
	
	//Integer saveReservation(LocalDate date,int dauer, int timeslot,String leaderid, String userid, int stuhlid, int bookingno);
	String deleteReservation(String bookingno);
	String deleteReservationLeader(String date, String timeslot, String leaderid);
	JSONArray getMultipleTimeSlots(String date, int dauer, String timeslot);
	//int recommendBooking(LocalDate date, int dauer, String timeslot, int guests);
	//JSONArray timeslotLoad(String date);
}