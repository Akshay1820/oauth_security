package com.demo.outh_security.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String homePage() {
        return "Hello World.... This is home page";
    }

    @GetMapping("/api")
    public String apiPage() {
        return "Hello World.... This is api page";
    }
}
