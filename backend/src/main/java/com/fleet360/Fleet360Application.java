package com.fleet360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class Fleet360Application {
    public static void main(String[] args) {
        SpringApplication.run(Fleet360Application.class, args);
    }
}
