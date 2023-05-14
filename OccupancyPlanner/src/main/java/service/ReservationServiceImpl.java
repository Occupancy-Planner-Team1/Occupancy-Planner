package service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.Chair;
import data.Reservation;
import dataRepository.ReservationRepository;
import dataRepository.StuhlRepository;

@Service
public class ReservationServiceImpl implements ReservationService {
	
	@Autowired
	ReservationRepository resRepo;
	@Autowired
	StuhlRepository stuhlRepo;
	
	private JSONArray timeslots=new JSONArray();
	private JSONArray timeslotHolder=new JSONArray();
	private JSONObject chairs;

	@Override
	public Integer saveReservation(LocalDate date,int dauer, int timeslot,String leaderid, String userid, int stuhlid, int bookingno) {
		
		//LocalDate dateNow=LocalDate.now();
		//Duration timePassed=Duration.between(dateNow, date);
		
		if((timeslot+dauer)>11)return null;
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
	}

	@Override
	public Integer deleteReservation(int bookingno, int timeslot) {
		if(!resRepo.findByBookingAndTime(bookingno, timeslot).isEmpty()) {
			resRepo.deleteAllByIdInBatch(resRepo.findByBookingAndTime(bookingno, timeslot));
			return bookingno;
		}
		return null;
		
		
	}

	@Override
	public JSONArray getMultipleTimeSlots(LocalDate date, int dauer, int timeslot) {
		
		timeslotHolder.clear();
		timeslots.clear();
		
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
	

	@Override
	public JSONArray timeslotLoad(LocalDate date) {
		
		JSONArray load=new JSONArray();
		
		for(int i=0;i<12;i++) {
			load.put(i,resRepo.findTaken(date, i).size()/32.0);
		}
		
		return load;
	}

	@Override
	public int recommendBooking(LocalDate date, int dauer, int timeslot, int guests) {
		
		Boolean flag=false;
		int tmpSlot;
		
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
		}
}
