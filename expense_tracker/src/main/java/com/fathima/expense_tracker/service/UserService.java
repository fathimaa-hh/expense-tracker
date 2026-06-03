package com.fathima.expense_tracker.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.User;
import com.fathima.expense_tracker.repository.UserRepository;

@Service

public class UserService {

    @Autowired
    private UserRepository userRepository;


    // =========================
    // REGISTER USER
    // =========================

    public User registerUser(User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return null;
        }

        return userRepository.save(user);
    }


    // =========================
    // LOGIN USER
    // =========================

    public User loginUser(
            String email,
            String password
    ) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isPresent()) {

            if (
                user.get()
                .getPassword()
                .equals(password)
            ) {

                return user.get();
            }
        }

        return null;
    }
}