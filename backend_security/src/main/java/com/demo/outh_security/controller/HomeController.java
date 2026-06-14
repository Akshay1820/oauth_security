package com.demo.outh_security.controller;

import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class HomeController {

    private final AppUserService userService;

    @GetMapping("/")
    public String homePage() {
        return "Hello World.... This is home page";
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AppUser>> getUsers() {
        SecurityContextHolder.getContext();
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
