package com.fathima.expense_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fathima.expense_tracker.model.Group;

public interface GroupRepository
        extends JpaRepository<Group, Long> {

    List<Group> findByCreatedBy(String createdBy);
}
