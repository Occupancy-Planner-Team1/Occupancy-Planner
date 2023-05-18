package service;


import java.time.LocalDate;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.designers.OCCUPANCY.dbtables.*;
import it.designers.OCCUPANCY.repository.*;

@Service
public class ReservationServiceImpl implements ReservationService {
	
	@Autowired
	ReservationRepository resRepo;
	@Autowired
	ChairRepository stuhlRepo;
	

	//Neue saveReservation muss mit Token ergänzt werden
	/*@Override   
	public Integer saveReservation(LocalDate date,int dauer, int timeslot,String leaderid, String userid, int stuhlid, int bookingno) {
		
		//LocalDate dateNow=LocalDate.now();
		//Duration timePassed=Duration.between(dateNow, date);
		
		if((timeslot+dauer)>11 || timeslot<0 || timeslot>11 || dauer<0 || dauer>3)return null;
		if(!resRepo.findTaken(date, timeslot).contains(stuhlid)) {
			
			for(int i=0;i<=dauer;i++) {
				
			Reservation reservation=new Reservation();
			Chair chair=stuhlRepo.findById(stuhlid);
			
			reservation.setChair(chair);
			reservation.setDate(date);
			reservation.setSlot(timeslot);
			timeslot=timeslot+1;
			reservation.setUser(userid);
			reservation.setLeaderId(leaderid);
			reservation.setBooking(bookingno);
			
			resRepo.save(reservation);
			
			}
			return stuhlid;
		}
		
		return null;
	}*/

	@Override
	public String deleteReservation(String bookingno) {
		if(!resRepo.findByBooking(bookingno).isEmpty()) {
			resRepo.deleteAllByIdInBatch(resRepo.findByBooking(bookingno));
			return bookingno;
		}
		return null;	
	}
	
	public String deleteReservationLeader(String date, String timeslot, String leaderid) {
		if(!resRepo.findTaken(date,timeslot).isEmpty()) {
			for(int i=0;i<resRepo.findTaken(date, timeslot).size();i++) {
				if(leaderid==resRepo.findLeaderId(resRepo.findTaken(date, timeslot).get(i), timeslot)) {
					resRepo.deleteById(resRepo.findByLeader(leaderid));
					return leaderid;
				}
			}
		}
		return null;
	}
	

	@Override
	public JSONArray getMultipleTimeSlots(String date, int dauer, String timeslot) {
		
		JSONArray timeslotHolder=new JSONArray();
		JSONArray timeslots=new JSONArray();
		JSONObject chairs;

		
		for(int j=0;j<dauer;j++) {
		for(int i=0;i<resRepo.findTaken(date, timeslot).size();i++) {
			
			chairs=new JSONObject();
			chairs.put(resRepo.findLeaderId(resRepo.findTaken(date, timeslot).get(i), timeslot), resRepo.findTaken(date, timeslot).get(i));
			
			timeslotHolder.put(i, chairs);
			
		}
		timeslots.put(j, timeslotHolder);
		timeslotHolder=new JSONArray();
		
		}
		
		return timeslots;

	}
	//timeslotLoad & recommendBooking gehen wegen timeslot(string) nicht mehr,

	/*@Override
	public JSONArray timeslotLoad(String date) {
		
		JSONArray load=new JSONArray();
		
		for(int i=0;i<12;i++) {
			load.put(i,resRepo.findTaken(date, i).size()/32.0);
		}
		
		return load;
	}*/

	/*@Override
	public int recommendBooking(LocalDate date, int dauer, String timeslot, int guests) {
		
		Boolean flag=false;
		String tmpSlot;
		
		for(int i=1;i<=32;i++) {
			tmpSlot=timeslot;
			for(int j=0;j<=dauer;j++) {
				
				if(!resRepo.findTaken(date, tmpSlot).contains(i))flag=true;
				if(resRepo.findTaken(date, tmpSlot).contains(i))flag=false;
				
				if(flag==false)break;
				tmpSlot=tmpSlot+1;
			}
			if(flag==true)return i;		
			
		}
		
		return 0;
		}*/
}