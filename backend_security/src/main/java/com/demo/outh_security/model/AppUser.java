package com.demo.outh_security.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String username;
    private String password;
    private String name;
    private String avatarUrl;

    @Enumerated(EnumType.STRING)

    private Provider provider;

    @Enumerated(EnumType.STRING)
    private ACCOUNT_TYPE accountType;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}