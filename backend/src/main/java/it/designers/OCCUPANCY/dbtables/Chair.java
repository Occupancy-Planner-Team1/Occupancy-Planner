package it.designers.OCCUPANCY.dbtables;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chair {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String tisch;
    private String posx;
    private String posy;
    
    public int getId() {
		return this.id;
	}

	public String getTisch() {
		return this.tisch;
	}

	public String getX() {
		return this.posx;
	}

	public String getY() {
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