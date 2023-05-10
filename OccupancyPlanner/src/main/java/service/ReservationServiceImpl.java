package service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

	@Override
	public Integer saveReservation(LocalDate date, String timeslot, String userid, int stuhlid, int bookingno) {
		
		//LocalDate dateNow=LocalDate.now();
		//Duration timePassed=Duration.between(dateNow, date);
		
		if(!resRepo.findTaken(date, timeslot).contains(stuhlid)) {
			
			Reservation reservation=new Reservation();
			Chair chair=stuhlRepo.findById(stuhlid);
			
			reservation.setChair(chair);
			reservation.setDate(date);
			reservation.setSlot(timeslot);
			reservation.setUser(userid);
			reservation.setBooking(bookingno);
			
			resRepo.save(reservation);
			return stuhlid;
		}
		
		return null;
	}

	@Override
	public Integer deleteReservation(int bookingno, String timeslot) {
		if(!resRepo.findByBookingAndTime(bookingno, timeslot).isEmpty()) {
			resRepo.deleteAllByIdInBatch(resRepo.findByBookingAndTime(bookingno, timeslot));
			return bookingno;
		}
		return null;
		
		
	}

	@Override
	public List<Integer> findFree(LocalDate date, String timeslot) {

		List<Integer> freeChairs=new ArrayList<Integer>();

		for(int i=1;i<33;i++) {
			if(!resRepo.findTaken(date, timeslot).contains(i)) {
				freeChairs.add(i);			
			}
		}
		
		return freeChairs;

	}

	@Override
	public double timeslotLoad(LocalDate date, String timeslot) {
		
		double load=resRepo.findTaken(date, timeslot).size()/32.0;
		
		return load;
	}
}
