package com.fathima.expense_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")

public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String email;

    private Double monthlyBudget;

    private Integer alertLimit;

    private String upiId;

    private String upiName;

    public UserSettings() {
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(Double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public Integer getAlertLimit() {
        return alertLimit;
    }

    public void setAlertLimit(Integer alertLimit) {
        this.alertLimit = alertLimit;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getUpiName() {
        return upiName;
    }

    public void setUpiName(String upiName) {
        this.upiName = upiName;
    }
}