package com.spring.oderservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.spring.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ShiptrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShiptrackApplication.class, args);
	}

}
