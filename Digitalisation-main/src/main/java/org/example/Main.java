package org.example;

import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeIn;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;
import org.example.repository.CompagnieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@SecurityScheme(
        securitySchemeName="Keycloak"
        ,openIdConnectUrl = "http://localhost:8180/realms/crm/.well-know"
        ,scheme = "bearer"
        ,type = SecuritySchemeType.OPENIDCONNECT
        ,in = SecuritySchemeIn.HEADER
)
@EnableScheduling
public class Main  {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }



    }
