package it.designers.OCCUPANCY.repository;

import it.designers.OCCUPANCY.dbtables.Mitarbeiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MitarbeiterRepository extends JpaRepository<Mitarbeiter, Long> {
//    @Query("SELECT m FROM Mitarbeiter m WHERE m.kcid = :_kcid")
//    Optional<Mitarbeiter> tryFindUser(UUID _kcid);


}
