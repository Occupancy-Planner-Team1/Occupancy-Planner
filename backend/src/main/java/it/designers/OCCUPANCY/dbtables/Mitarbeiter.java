package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "mitarbeiter")
public class Mitarbeiter {

    @Id // select WHERE timeslot = ...
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
  //  @Column(name = "id", updatable = false, nullable = false)
    private Integer id;
    @Column(name = "prename")
    private String prename;
    @Column(name="lastname")
    private String lastname;
    @Column(name = "kcid")
    private UUID kcid;

}