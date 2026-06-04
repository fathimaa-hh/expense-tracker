package com.fathima.expense_tracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.dto.PersonalSummaryDTO;
import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.model.Settlement;
import com.fathima.expense_tracker.repository.ExpenseRepository;
import com.fathima.expense_tracker.repository.SettlementRepository;

@Service

public class PersonalService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    public PersonalSummaryDTO getSummary(
            String email
    ) {

        PersonalSummaryDTO dto =
                new PersonalSummaryDTO();

        List<Expense> expenses =
                expenseRepository
                .findByCreatedBy(email);

        List<Settlement> payables =
                settlementRepository
                .findByPayer(email);

        List<Settlement> receivables =
                settlementRepository
                .findByReceiver(email);

        double personalExpense = 0;

        double completedGroupExpense = 0;

        double pendingToPay = 0;

        double moneyToReceive = 0;

        // =========================
        // PERSONAL EXPENSES
        // =========================
        for (Expense expense : expenses) {

            if (
                expense.getGroupName() == null
                ||
                expense.getGroupName()
                .equals("Personal")
            ) {

                personalExpense +=
                        expense.getAmount();
            }

        }

        // =========================
        // PENDING + COMPLETED PAYABLES
        // =========================
        for (Settlement settlement : payables) {

            if (
                settlement.getStatus()
                .equalsIgnoreCase("Pending")
            ) {

                pendingToPay +=
                        settlement.getAmount();

            } else {

                completedGroupExpense +=
                        settlement.getAmount();
            }

        }

        // =========================
        // MONEY TO RECEIVE
        // =========================
        for (Settlement settlement : receivables) {

            if (
                settlement.getStatus()
                .equalsIgnoreCase("Pending")
            ) {

                moneyToReceive +=
                        settlement.getAmount();
            }

        }

        // =========================
        // NET EXPENSE
        // =========================
        double netExpense =

                personalExpense
                +
                completedGroupExpense;

        dto.setPersonalExpense(
                personalExpense
        );

        dto.setCompletedGroupExpense(
                completedGroupExpense
        );

        dto.setPendingToPay(
                pendingToPay
        );

        dto.setMoneyToReceive(
                moneyToReceive
        );

        dto.setNetExpense(
                netExpense
        );

        return dto;
    }
}
