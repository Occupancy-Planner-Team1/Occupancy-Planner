package it.designers.OCCUPANCY.dbtables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private LocalDate datum;

    @Column
    private int timeslot; // Werte 1 - 12

    @Column
    UUID bucher;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn
    List<Reservation> reservations = new ArrayList<>();
}
