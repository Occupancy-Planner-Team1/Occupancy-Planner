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
	
	@GetMapping("seats/{date}/{dauer}/{timeslot}")
	public ResponseEntity getMultipleTimeSlots(@PathVariable("date") String stringDate, @PathVariable("dauer") int dauer, @PathVariable("timeslot") int timeslot) {
		LocalDate date=LocalDate.parse(stringDate);
		return ResponseEntity.ok(this.resService.getMultipleTimeSlots(date, dauer, timeslot).toString());
	}
	
	@GetMapping("recommend/{date}/{dauer}/{timeslot}")
	public ResponseEntity recommendBooking(@PathVariable("date") String stringDate, @PathVariable("dauer") int dauer, @PathVariable("timeslot") int timeslot) {
		LocalDate date=LocalDate.parse(stringDate);
		return ResponseEntity.ok(this.resService.recommendBooking(date, dauer, timeslot, 0));
	}
	
	
	@PutMapping("book/{date}/{dauer}/{timeslot}/{leaderid}/{userid}/{stuhlId}/{bookingNo}")
	public ResponseEntity setReservation(@PathVariable("date")String stringDate,@PathVariable("dauer")int dauer, @PathVariable("timeslot") int timeslot,@PathVariable("leaderid") String leaderid, @PathVariable("userid") String userid, @PathVariable("stuhlId") int chairId, @PathVariable("bookingNo") int booking) {
		
		LocalDate date=LocalDate.parse(stringDate);
		
		if(chairId<0 || chairId>32) {
			return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Invalid chair index");
		}
		if(resService.saveReservation(date, dauer, timeslot, leaderid, userid, chairId, booking)!=null){
			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation accepted");
		}
		return ResponseEntity.status(HttpStatus.SC_FORBIDDEN).body("Chair already reserved");
		
	}
	
	@DeleteMapping("book/{bookingNo}/{timeslot}")
	public ResponseEntity deleteReservation(@PathVariable("bookingNo") int bookingNo,@PathVariable("timeslot") int timeslot) {
		if(resService.deleteReservation(bookingNo, timeslot)!=null) {
			return ResponseEntity.status(HttpStatus.SC_OK).body("Reservation deleted");
		}
		return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Reservation doesnt exist");
		
	}
	 
	@GetMapping("timeslots/{date}")
	public ResponseEntity timeslotLoad(@PathVariable("date") String stringDate) {
		LocalDate date=LocalDate.parse(stringDate);
		return ResponseEntity.ok(this.resService.timeslotLoad(date).toString());
	}
	
	
	

}
