package com.fathima.expense_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.repository.ExpenseRepository;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin

public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    // =========================
    // SAVE EXPENSE
    // =========================
    @PostMapping

    public Expense addExpense(
            @RequestBody Expense expense
    ) {

        return expenseRepository.save(expense);
    }

    // =========================
    // GET USER EXPENSES
    // =========================
    @GetMapping("/{email}")

    public List<Expense> getExpenses(
            @PathVariable String email
    ) {

        return expenseRepository
                .findByCreatedBy(email);
    }

}