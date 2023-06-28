package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data                       //Markiert Klasse als Datenklasse
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reservation") // ist das ok so? muss, kann, soll oder darf nicht?
public class Reservation {

    @Id // select WHERE timeslot = ...
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

//      @Entity annotation indicates that the class is a persistent Java class.
//      @Table annotation provides the table that maps this entity.
//      @Id annotation is for the primary key.
//      @GeneratedValue annotation is used to define generation strategy for the primary key. GenerationType.AUTO means Auto Increment field.
//      @Column annotation is used to define the column in database that maps annotated field.

    @Column
    private UUID stuhlsitzer;

    @JoinColumn(referencedColumnName = "id")
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private Chair chair;

//    @JoinColumn(referencedColumnName = "id")
//    @OneToOne(cascade = CascadeType.ALL)
//    private Booking booking;
}