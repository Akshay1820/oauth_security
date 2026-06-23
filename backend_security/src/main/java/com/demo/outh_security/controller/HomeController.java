package com.demo.outh_security.controller;

import com.demo.outh_security.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class HomeController {

    private final AppUserService userService;

    @GetMapping("/")
    public String homePage() {
        return "Hello World.... This is home page";
    }

}

