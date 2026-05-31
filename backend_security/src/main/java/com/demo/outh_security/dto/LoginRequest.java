package com.demo.outh_security.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
