package com.fathima.expense_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.model.Group;
import com.fathima.expense_tracker.service.GroupService;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin

public class GroupController {

    @Autowired
    private GroupService groupService;

    // =========================
    // SAVE GROUP
    // =========================
    @PostMapping

    public Group saveGroup(
            @RequestBody Group group
    ) {

        return groupService.saveGroup(group);
    }

    // =========================
    // GET USER GROUPS
    // =========================
    @GetMapping("/{email}")

    public List<Group> getUserGroups(
            @PathVariable String email
    ) {

        return groupService.getUserGroups(email);
    }
}