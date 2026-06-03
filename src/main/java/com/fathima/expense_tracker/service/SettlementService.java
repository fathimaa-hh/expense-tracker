package com.fathima.expense_tracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.Settlement;
import com.fathima.expense_tracker.repository.SettlementRepository;

@Service

public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;


    // =========================
    // SAVE
    // =========================
    public Settlement saveSettlement(
            Settlement settlement
    ) {

        return settlementRepository.save(settlement);
    }


    // =========================
    // GET USER SETTLEMENTS
    // =========================
    public List<Settlement> getUserSettlements(
            String email
    ) {

        return settlementRepository.findByPayer(email);
    }


    // =========================
    // MARK AS COMPLETED
    // =========================
    public Settlement completeSettlement(
            Long id
    ) {

        Settlement settlement =
                settlementRepository
                .findById(id)
                .orElseThrow();

        settlement.setStatus("Completed");

        return settlementRepository
                .save(settlement);
    }

}