package com.demo.outh_security.dto;

import lombok.Builder;
import lombok.Data;


@Builder
@Data
public class LoginResponse {
    String token;
}
