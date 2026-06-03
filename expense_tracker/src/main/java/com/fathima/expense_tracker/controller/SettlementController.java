package com.fathima.expense_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.Settlement;
import com.fathima.expense_tracker.service.SettlementService;

@RestController
@RequestMapping("/api/settlements")
@CrossOrigin

public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @PostMapping

    public Settlement saveSettlement(
            @RequestBody Settlement settlement
    ) {

        return settlementService.saveSettlement(settlement);
    }

    @GetMapping("/{payer}")

    public List<Settlement> getUserSettlements(
            @PathVariable String payer
    ) {

        return settlementService.getUserSettlements(payer);
    }
}
