package com.fathima.expense_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.UserSettings;
import com.fathima.expense_tracker.repository.UserSettingsRepository;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin

public class UserSettingsController {

    @Autowired
    private UserSettingsRepository repository;

    // =========================
    // GET SETTINGS
    // =========================
    @GetMapping("/{email}")

    public UserSettings getSettings(
            @PathVariable String email
    ) {

        UserSettings settings =
                repository.findByEmail(email);

        if (settings == null) {

            settings = new UserSettings();

            settings.setEmail(email);

            settings.setMonthlyBudget(0.0);

            settings.setAlertLimit(80);

            settings.setUpiId("");

            settings.setUpiName("");
        }

        return settings;
    }

    // =========================
    // SAVE SETTINGS
    // =========================
    @PostMapping

    public UserSettings saveSettings(
            @RequestBody UserSettings settings
    ) {

        UserSettings existing =
                repository.findByEmail(
                        settings.getEmail()
                );

        if (existing != null) {

            existing.setMonthlyBudget(
                    settings.getMonthlyBudget()
            );

            existing.setAlertLimit(
                    settings.getAlertLimit()
            );

            existing.setUpiId(
                    settings.getUpiId()
            );

            existing.setUpiName(
                    settings.getUpiName()
            );

            return repository.save(existing);
        }

        return repository.save(settings);
    }
}