package com.fathima.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fathima.expense_tracker.model.UserSettings;

public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Long> {

    UserSettings findByEmail(String email);
}