package com.fathima.expense_tracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.repository.ExpenseRepository;

@Service

public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;


    // =========================
    // SAVE EXPENSE
    // =========================

    public Expense saveExpense(
            Expense expense
    ) {

        return expenseRepository.save(expense);
    }


    // =========================
    // GET ALL EXPENSES
    // =========================

    public List<Expense> getAllExpenses() {

        return expenseRepository.findAll();
    }


    // =========================
    // GET USER EXPENSES
    // =========================

    public List<Expense> getUserExpenses(
            String email
    ) {

        return expenseRepository.findByCreatedBy(email);
    }
}

