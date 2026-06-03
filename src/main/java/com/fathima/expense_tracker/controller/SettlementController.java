package com.fathima.expense_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.Settlement;
import com.fathima.expense_tracker.repository.SettlementRepository;

@RestController
@RequestMapping("/api/settlements")
@CrossOrigin

public class SettlementController {

    @Autowired
    private SettlementRepository settlementRepository;


    // =========================
    // SAVE SETTLEMENT
    // =========================
    @PostMapping

    public Settlement saveSettlement(
            @RequestBody Settlement settlement
    ) {

        return settlementRepository.save(settlement);
    }


    // =========================
    // GET USER SETTLEMENTS
    // =========================
    @GetMapping("/user/{email}")

    public List<Settlement> getUserSettlements(
            @PathVariable String email
    ) {

        List<Settlement> payerList =
                settlementRepository.findByPayer(email);

        List<Settlement> receiverList =
                settlementRepository.findByReceiver(email);

        payerList.addAll(receiverList);

        return payerList;
    }


    // =========================
    // MARK AS PAID
    // =========================
    @PutMapping("/pay/{id}")

    public Settlement markAsPaid(
            @PathVariable Long id
    ) {

        Settlement settlement =
                settlementRepository
                .findById(id)
                .orElseThrow();

        settlement.setStatus("completed");

        return settlementRepository.save(settlement);
    }

}