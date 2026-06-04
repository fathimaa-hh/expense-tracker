package com.fathima.expense_tracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.Settings;
import com.fathima.expense_tracker.repository.SettingsRepository;

@Service

public class SettingsService {

    @Autowired
    private SettingsRepository settingsRepository;

    // =========================
    // GET SETTINGS
    // =========================
    public Settings getSettings(String email) {

        Settings settings =
                settingsRepository.findByEmail(email);

        if (settings == null) {

            settings = new Settings();

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
    public Settings saveSettings(Settings settings) {

        Settings existing =
                settingsRepository
                        .findByEmail(
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

            return settingsRepository.save(existing);
        }

        return settingsRepository.save(settings);
    }
}