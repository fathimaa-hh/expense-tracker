package com.fathima.expense_tracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fathima.expense_tracker.model.Group;
import com.fathima.expense_tracker.repository.GroupRepository;

@Service

public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public Group saveGroup(Group group) {

        return groupRepository.save(group);
    }

    public List<Group> getUserGroups(
            String email
    ) {

        return groupRepository.findByCreatedBy(email);
    }
}