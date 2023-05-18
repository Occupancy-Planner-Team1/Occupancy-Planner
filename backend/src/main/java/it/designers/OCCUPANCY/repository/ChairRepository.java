package it.designers.OCCUPANCY.repository;

import it.designers.OCCUPANCY.dbtables.Chair;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChairRepository extends JpaRepository<Chair, Long> {
}
