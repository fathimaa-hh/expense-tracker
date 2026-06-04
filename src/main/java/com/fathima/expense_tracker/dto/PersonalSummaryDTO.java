package com.fathima.expense_tracker.dto;

public class PersonalSummaryDTO {

    private double personalExpense;

    private double completedGroupExpense;

    private double pendingToPay;

    private double moneyToReceive;

    private double netExpense;

    public PersonalSummaryDTO() {
    }

    public double getPersonalExpense() {
        return personalExpense;
    }

    public void setPersonalExpense(double personalExpense) {
        this.personalExpense = personalExpense;
    }

    public double getCompletedGroupExpense() {
        return completedGroupExpense;
    }

    public void setCompletedGroupExpense(double completedGroupExpense) {
        this.completedGroupExpense =
                completedGroupExpense;
    }

    public double getPendingToPay() {
        return pendingToPay;
    }

    public void setPendingToPay(double pendingToPay) {
        this.pendingToPay = pendingToPay;
    }

    public double getMoneyToReceive() {
        return moneyToReceive;
    }

    public void setMoneyToReceive(double moneyToReceive) {
        this.moneyToReceive = moneyToReceive;
    }

    public double getNetExpense() {
        return netExpense;
    }

    public void setNetExpense(double netExpense) {
        this.netExpense = netExpense;
    }
}