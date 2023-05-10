package dataRepository;
import org.springframework.stereotype.Repository;

import data.Chair;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface StuhlRepository extends JpaRepository<Chair, Integer>{
	@Query(value="SELECT * FROM chair WHERE id=:id",nativeQuery=true)
	Chair findById(@Param("id")int id);
	
	@Query(value="SELECT * FROM chair WHERE res=:id", nativeQuery=true)
	Chair findByRes(@Param("id")int id);
	
} 