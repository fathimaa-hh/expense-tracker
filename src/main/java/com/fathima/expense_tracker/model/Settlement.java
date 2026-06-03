package com.fathima.expense_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "settlements")

public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String payer;

    private String receiver;

    private Double amount;

    private String status;

    private String expenseTitle;

    private String groupName;

    public Settlement() {
    }

    public Settlement(
            String payer,
            String receiver,
            Double amount,
            String status,
            String expenseTitle,
            String groupName
    ) {
        this.payer = payer;
        this.receiver = receiver;
        this.amount = amount;
        this.status = status;
        this.expenseTitle = expenseTitle;
        this.groupName = groupName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExpenseTitle() {
        return expenseTitle;
    }

    public void setExpenseTitle(String expenseTitle) {
        this.expenseTitle = expenseTitle;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
}