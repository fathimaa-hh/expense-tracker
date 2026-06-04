package com.fathima.expense_tracker.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.model.UserSettings;
import com.fathima.expense_tracker.repository.ExpenseRepository;
import com.fathima.expense_tracker.repository.UserSettingsRepository;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin

public class AnalyticsController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserSettingsRepository settingsRepository;

    // =========================
    // MONTHLY ANALYTICS
    // =========================
    @GetMapping("/{email}")

    public Map<String, Object> getAnalytics(
            @PathVariable String email
    ) {

        List<Expense> expenses =
                expenseRepository.findByCreatedBy(email);

        double totalSpent = 0;

        LocalDate now = LocalDate.now();

        for (Expense expense : expenses) {

            if (
                expense.getExpenseDate() != null
            ) {

                LocalDate expenseDate =
                        expense.getExpenseDate();

                if (
                    expenseDate.getMonth()
                    ==
                    now.getMonth()

                    &&

                    expenseDate.getYear()
                    ==
                    now.getYear()
                ) {

                    totalSpent +=
                            expense.getAmount();
                }
            }
        }

        UserSettings settings =
                settingsRepository.findByEmail(email);

        double budget = 0;

        int alertLimit = 80;

        if (settings != null) {

            budget =
                    settings.getMonthlyBudget();

            alertLimit =
                    settings.getAlertLimit();
        }

        double usedPercentage = 0;

        if (budget > 0) {

            usedPercentage =
                    (totalSpent / budget) * 100;
        }

        String warning = "";

        if (usedPercentage >= 100) {

            warning =
                    "🚨 Budget exceeded!";
        }

        else if (
                usedPercentage >= alertLimit
        ) {

            warning =
                    "⚠ Budget limit crossed!";
        }

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "totalSpent",
                totalSpent
        );

        result.put(
                "budget",
                budget
        );

        result.put(
                "remaining",
                budget - totalSpent
        );

        result.put(
                "usedPercentage",
                usedPercentage
        );

        result.put(
                "warning",
                warning
        );

        return result;
    }
}