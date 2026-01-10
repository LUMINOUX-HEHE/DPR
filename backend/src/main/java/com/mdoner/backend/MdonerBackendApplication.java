package com.mdoner.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MdonerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MdonerBackendApplication.class, args);
	}

}
