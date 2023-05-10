package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import controller.Controller;

@SpringBootApplication(scanBasePackages= {"controller","service"})

@EnableJpaRepositories("dataRepository")
@EntityScan("data")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
