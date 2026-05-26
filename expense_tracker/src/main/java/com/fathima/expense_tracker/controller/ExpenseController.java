package com.fathima.expense_tracker.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.fathima.expense_tracker.model.Expense;
import com.fathima.expense_tracker.repository.ExpenseRepository;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin

public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo) {
        this.repo = repo;
    }

    // =========================
    // GET ALL EXPENSES
    // =========================

    @GetMapping
    public List<Expense> getAllExpenses() {

        return repo.findAll();
    }

    // =========================
    // GET USER EXPENSES
    // =========================

    @GetMapping("/{email}")

    public List<Expense> getUserExpenses(
            @PathVariable String email
    ) {

        return repo.findByCreatedBy(email);
    }

    // =========================
    // ADD EXPENSE
    // =========================

    @PostMapping

    public Expense addExpense(
            @RequestBody Expense expense
    ) {

        return repo.save(expense);
    }
}