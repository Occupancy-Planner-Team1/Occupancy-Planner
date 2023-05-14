package data;

import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="Chair")
public class Chair {
	
	@Id
	@Column(name="id")
	private int id;
	
	@Column(name="tisch")
	private String tisch;
	
	@Column(name="posx")
	private int posx;
	
	@Column(name="posy")
	private int posy;
	
	public int getId() {
		return this.id;
	}
	
	public String getTisch() {
		return this.tisch;
	}
	
	public int getX() {
		return this.posx;
	}
	
	public int getY() {
		return this.posy;
	}
	
	@OneToMany(fetch=FetchType.LAZY)
	private List<Reservation> reservation;
	
	public List<Reservation> getReservation() {
		return reservation;
	}
	public void setReservation(List<Reservation> res) {
		this.reservation=res;
	}

}
