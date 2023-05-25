package it.designers.OCCUPANCY;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.designers.OCCUPANCY.controller.OccuControl;
import it.designers.OCCUPANCY.dbtables.Booking;
import it.designers.OCCUPANCY.dbtables.Chair;
import it.designers.OCCUPANCY.dbtables.Reservation;

@SpringBootTest
@AutoConfigureMockMvc(addFilters=false)
@ExtendWith(MockitoExtension.class)
public class OccuControlTest { //??brauchen dummy datenbank für die tests??
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private BookingService bookingService;
	
	@Autowired
	ObjectMapper objMapper;
	
	Booking testBooking=new Booking();
	Chair testChair = new Chair();
	Reservation testReservation = new Reservation();
	
	@BeforeEach
	public void init() {
		
		testReservation.setChair(testChair);
		testReservation.setStuhlsitzer(UUID.randomUUID());
		
		testBooking.setBucher(UUID.randomUUID());
		//testBooking.setDatum(LocalDate.now());
		testBooking.setTimeslot(0);
		
		testBooking.getReservations().add(testReservation);
	}
	
	@Test
	public void neueBuchung() throws Exception{
	
		String inputInJson=this.mapToJson(testBooking);
		
		String URI="/api/auth/res";
		
		//Mockito.doNothing().when(bookingService).save(testBooking);
		
		RequestBuilder requestBuilder=MockMvcRequestBuilders
				.post(URI)
				.accept(MediaType.APPLICATION_JSON).content(inputInJson)
				.contentType(MediaType.APPLICATION_JSON);
		
		MvcResult result=mockMvc.perform(requestBuilder).andReturn();
		MockHttpServletResponse response =result.getResponse();
		
		//String outputInJson=response.getContentAsString();
	
		//assertThat(outputInJson).isEqualTo(inputInJson);
		assertEquals(HttpStatus.OK.value(), response.getStatus());
		
		
		
		
		
	}
	@Test
	public void testGetAll() throws Exception{
		String URI="/api/auth/res-all";
		
		List<Booking> testListBooking = new ArrayList<>();
		testListBooking.add(testBooking);
		
		//String inputInJson=mapToJson(testBooking);
		
        Mockito.when(bookingService.getAll()).thenReturn(testListBooking);
		
		RequestBuilder requestBuilder=MockMvcRequestBuilders
				.get(URI);
				
		MvcResult result=mockMvc.perform(requestBuilder).andReturn();
		MockHttpServletResponse response =result.getResponse();
		
		//String outputInJson=response.getContentAsString();
	
		//assertThat(outputInJson).isEqualTo(inputInJson);
		assertEquals(HttpStatus.OK.value(), response.getStatus());
	}
	
	private String mapToJson(Object object) throws JsonProcessingException{
		objMapper=new ObjectMapper();
		return objMapper.writeValueAsString(object);
	}

}
