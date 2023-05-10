package controller;



import java.time.LocalDate;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import data.Chair;
import data.Reservation;
import dataRepository.ReservationRepository;
import dataRepository.StuhlRepository;
import service.ReservationService;


@RestController
@RequestMapping("/reservation")
public class Controller {
	
	@Autowired
	ReservationService resService;
	
	@GetMapping("/seats/{date}/{timeslot}")
	public ResponseEntity getFreeChairsTimeSlot(@PathVariable("date") String stringDate, @PathVariable("timeslot") String timeslot) {
		LocalDate date=LocalDate.parse(stringDate);
		return ResponseEntity.ok(this.resService.findFree(date, timeslot));
	}
	
	
	@PutMapping("book/{date}/{timeslot}/{userid}/{stuhlId}/{bookingNo}")
	public ResponseEntity setReservation(@PathVariable("date")String stringDate, @PathVariable("timeslot") String timeslot, @PathVariable("userid") String userid, @PathVariable("stuhlId") int chairId, @PathVariable("bookingNo") int booking) {
		
		LocalDate date=LocalDate.parse(stringDate);
		
		if(chairId<0 || chairId>32) {
			return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Invalid chair index");
		}
		if(resService.saveReservation(date, timeslot, userid, chairId, booking)!=null){
			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation accepted");
		}
		return ResponseEntity.status(HttpStatus.SC_FORBIDDEN).body("Chair already reserved");
		
	}
	
	@DeleteMapping("book/{bookingNo}/{timeslot}")
	public ResponseEntity deleteReservation(@PathVariable("bookingNo") int bookingNo,@PathVariable("timeslot") String timeslot) {
		if(resService.deleteReservation(bookingNo, timeslot)!=null) {
			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation deleted");
		}
		return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Reservation doesnt exist");
		
	}
	 
	@GetMapping("timeslots/{date}/{timeslot}")
	public ResponseEntity timeslotLoad(@PathVariable("date") String stringDate, @PathVariable("timeslot") String timeslot) {
		LocalDate date=LocalDate.parse(stringDate);
		return ResponseEntity.ok(this.resService.timeslotLoad(date, timeslot));
	}
	
	
	

}
