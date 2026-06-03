package com.fathima.expense_tracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")

public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String title;

    private Double amount;

    private String category;

    @Column(name = "expense_date")
    private LocalDate expenseDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "split_type")
    private String splitType;

    // =========================
    // NEW FIELD
    // =========================
    @Column(name = "selected_members")
    private String selectedMembers;

    // =========================
    // CONSTRUCTOR
    // =========================
    public Expense() {
    }

    public Expense(
            String title,
            Double amount,
            String category,
            LocalDate expenseDate,
            String createdBy,
            String groupName,
            String splitType,
            String selectedMembers
    ) {
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.expenseDate = expenseDate;
        this.createdBy = createdBy;
        this.groupName = groupName;
        this.splitType = splitType;
        this.selectedMembers = selectedMembers;
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getSplitType() {
        return splitType;
    }

    public void setSplitType(String splitType) {
        this.splitType = splitType;
    }

    public String getSelectedMembers() {
        return selectedMembers;
    }

    public void setSelectedMembers(String selectedMembers) {
        this.selectedMembers = selectedMembers;
    }
}