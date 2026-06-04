package com.fathima.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fathima.expense_tracker.model.Settings;

public interface SettingsRepository
        extends JpaRepository<Settings, Long> {

    Settings findByEmail(String email);
}
