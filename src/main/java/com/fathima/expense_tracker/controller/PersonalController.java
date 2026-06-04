package com.fathima.expense_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.dto.PersonalSummaryDTO;
import com.fathima.expense_tracker.service.PersonalService;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin

public class PersonalController {

    @Autowired
    private PersonalService personalService;

    @GetMapping("/summary/{email}")

    public PersonalSummaryDTO getSummary(
            @PathVariable String email
    ) {

        return personalService
                .getSummary(email);
    }
}