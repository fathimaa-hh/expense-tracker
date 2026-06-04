package com.fathima.expense_tracker.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.model.Settlement;
import com.fathima.expense_tracker.repository.ExpenseRepository;
import com.fathima.expense_tracker.repository.SettlementRepository;

@Service

public class ReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    public Map<String, Object> generateUserReport(
            String email
    ) {

        List<Expense> expenses =
                expenseRepository.findByCreatedBy(email);

        List<Settlement> settlements =
                settlementRepository.findByPayer(email);

        double totalSpent = 0;

        double food = 0;
        double rent = 0;
        double travel = 0;
        double shopping = 0;

        // =========================
        // EXPENSES
        // =========================

        for (Expense expense : expenses) {

            totalSpent += expense.getAmount();

            String category =
                    expense.getCategory();

            if (category == null) continue;

            switch (category.toLowerCase()) {

                case "food":
                    food += expense.getAmount();
                    break;

                case "rent":
                    rent += expense.getAmount();
                    break;

                case "travel":
                    travel += expense.getAmount();
                    break;

                case "shopping":
                    shopping += expense.getAmount();
                    break;
            }
        }

        // =========================
        // PENDING DUES
        // =========================

        double pendingDues = 0;

        for (Settlement settlement : settlements) {

            if (
                settlement.getStatus()
                .equalsIgnoreCase("Pending")
            ) {

                pendingDues +=
                        settlement.getAmount();
            }
        }

        // =========================
        // RESPONSE MAP
        // =========================

        Map<String, Object> report =
                new HashMap<>();

        report.put("totalSpent", totalSpent);

        report.put("food", food);

        report.put("rent", rent);

        report.put("travel", travel);

        report.put("shopping", shopping);

        report.put("pendingDues", pendingDues);

        return report;
    }
}