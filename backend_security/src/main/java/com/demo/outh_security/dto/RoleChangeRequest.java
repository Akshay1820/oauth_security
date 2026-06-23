package com.demo.outh_security.dto;

import lombok.Data;

@Data
public class RoleChangeRequest {
    private String role; // "ROLE_ADMIN" or "ROLE_USER"
}
