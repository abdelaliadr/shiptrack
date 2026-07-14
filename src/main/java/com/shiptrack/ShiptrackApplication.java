package com.shiptrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

import com.shiptrack.config.AppProperties;

@SpringBootApplication
@EnableAsync
@EnableConfigurationProperties(AppProperties.class)
public class ShiptrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShiptrackApplication.class, args);
	}

}
