package com.demo.outh_security.config;

import com.demo.outh_security.model.ACCOUNT_TYPE;
import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.model.Provider;
import com.demo.outh_security.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.password}")
    String password;

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {

            if (appUserRepository.findByUsername("admin").isEmpty()) {

                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setName("System Administrator");

                admin.setPassword(
                        passwordEncoder.encode(password)
                );

                admin.setProvider(Provider.LOCAL);
                admin.setAccountType(ACCOUNT_TYPE.ROLE_ADMIN);

                admin.setCreatedAt(LocalDateTime.now());
                admin.setLastLoginAt(LocalDateTime.now());

                appUserRepository.save(admin);

                System.out.println("Admin user created successfully");
            }
        };
    }
}
