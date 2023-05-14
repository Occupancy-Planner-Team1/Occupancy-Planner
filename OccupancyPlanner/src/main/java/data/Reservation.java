package data;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="Reservation")
public class Reservation {
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	
	@Column(name="date")
	private LocalDate date;
	
	@Column(name="timeslot")
	private int timeslot;
	
	@Column(name="memberid")
	private String memberid;
	
	@Column(name="bookingid")
	private int bookingid;
	
	@Column(name="leaderid")
	private String leaderid;
	
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="chairid")
	private Chair chair;
	
	
	public Reservation() {
		
	}
	
	public int getId() {
		return this.id;
	}
	
	public LocalDate getDate() {
		return this.date;
	}
	
	public int getSlot() {
		return this.timeslot;
	}
	
	public String getUser() {
		return this.memberid;
	}
	
	public int getBooking() {
		return this.bookingid;
	}
	
	public String getLeaderId() {
		return this.leaderid;
	}
	
	public Chair getChair() {
		return this.chair;
	}
	
	public void setDate(LocalDate date) {
		this.date=date;
	}
	
	public void setSlot(int slot) {
		this.timeslot=slot;
	}
	
	public void setUser(String user) {
		this.memberid=user;
	}
	
	public void setBooking(int booking) {
		this.bookingid=booking;
	}
	
	public void setLeaderId(String leaderid) {
		this.leaderid=leaderid;
	}
	
	public void setChair(Chair chair) {
		this.chair=chair;
	}
	
	

}
