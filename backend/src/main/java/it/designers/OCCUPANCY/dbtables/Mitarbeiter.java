package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Mitarbeiter {

    @Id // select WHERE timeslot = ...
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)

    private Integer id;
    private String prename;
    private String lastname;
    private String kcid;

}