package com.demo.outh_security.dto;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AppUserDto {
    private String userName;
    private String name;
    private String email;
    private String avatarUrl;
    private String provider;
}
