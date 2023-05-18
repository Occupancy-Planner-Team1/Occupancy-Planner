package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data                       //Markiert Klasse als Datenklasse
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reservation") // ist das ok so? muss, kann, soll oder darf nicht?
public class Reservation {

    @Id // select WHERE timeslot = ...
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)

//      @Entity annotation indicates that the class is a persistent Java class.
//      @Table annotation provides the table that maps this entity.
//      @Id annotation is for the primary key.
//      @GeneratedValue annotation is used to define generation strategy for the primary key. GenerationType.AUTO means Auto Increment field.
//      @Column annotation is used to define the column in database that maps annotated field.

    private Long id;

    private String datum;
    private String timeslot; //modulo12 -> 1: 11.00-11.15 2: 11.15-11.30 ...
    private String leaderid;
    private String memberid;
    private String bookingid;
    
    
    @ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="chairid")
	private Chair chair;
    
    public Long getId() {
		return this.id;
	}

	public String getSlot() {
		return this.timeslot;
	}

	public String getUser() {
		return this.memberid;
	}

	public String getBooking() {
		return this.bookingid;
	}

	public String getLeaderId() {
		return this.leaderid;
	}

	public Chair getChair() {
		return this.chair;
	}
	public String getDate() {
		return this.datum;
	}

	public void setSlot(String slot) {
		this.timeslot=slot;
	}

	public void memberId(String user) {
		this.memberid=user;
	}

	public void setBooking(String booking) {
		this.bookingid=booking;
	}

	public void setLeaderId(String leaderid) {
		this.leaderid=leaderid;
	}
	public void setDate(String date) {
		this.datum=date;
	}
	public void setChair(Chair chair) {
		this.chair=chair;
	}

}