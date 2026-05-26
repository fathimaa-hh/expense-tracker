package com.fathima.expense_tracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.User;
import com.fathima.expense_tracker.service.UserService;

@RestController

@RequestMapping("/api/auth")

@CrossOrigin

public class AuthController {

    @Autowired
    private UserService userService;


    // =========================
    // REGISTER API
    // =========================

    @PostMapping("/register")

    public Map<String, Object> registerUser(
            @RequestBody User user
    ) {

        Map<String, Object> response =
                new HashMap<>();

        User savedUser =
                userService.registerUser(user);

        if (savedUser == null) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Email already exists"
            );

            return response;
        }

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Registration successful"
        );

        response.put(
                "user",
                savedUser
        );

        return response;
    }


    // =========================
    // LOGIN API
    // =========================

    @PostMapping("/login")

    public Map<String, Object> loginUser(
            @RequestBody Map<String, String> body
    ) {

        String email =
                body.get("email");

        String password =
                body.get("password");

        User user =
                userService.loginUser(
                        email,
                        password
                );

        Map<String, Object> response =
                new HashMap<>();

        if (user == null) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Invalid email or password"
            );

            return response;
        }

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Login successful"
        );

        response.put(
                "user",
                user
        );

        return response;
    }
}
