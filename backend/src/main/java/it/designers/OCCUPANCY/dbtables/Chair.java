package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Long id;
    private String tisch;
    private String posx;
    private String posy;

}