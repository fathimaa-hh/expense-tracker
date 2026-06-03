package com.fathima.expense_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fathima.expense_tracker.model.Settlement;

public interface SettlementRepository
        extends JpaRepository<Settlement, Long> {

    List<Settlement> findByPayer(String payer);

}
