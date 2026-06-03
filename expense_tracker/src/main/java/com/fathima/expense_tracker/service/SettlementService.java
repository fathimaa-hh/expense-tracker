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

    public Settlement saveSettlement(
            Settlement settlement
    ) {

        return settlementRepository.save(settlement);
    }

    public List<Settlement> getUserSettlements(
            String payer
    ) {

        return settlementRepository.findByPayer(payer);
    }
}