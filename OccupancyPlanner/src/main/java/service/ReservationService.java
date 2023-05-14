package service;

import java.time.LocalDate;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import data.Reservation;

public interface ReservationService {
	
	Integer saveReservation(LocalDate date,int dauer, int timeslot,String leaderid, String userid, int stuhlid, int bookingno);
	Integer deleteReservation(int bookingno, int timeslot);
	JSONArray getMultipleTimeSlots(LocalDate date, int dauer, int timeslot);
	int recommendBooking(LocalDate date, int dauer, int timeslot, int guests);
	JSONArray timeslotLoad(LocalDate date);
}
