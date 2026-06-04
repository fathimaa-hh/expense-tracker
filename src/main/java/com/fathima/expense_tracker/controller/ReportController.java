package com.fathima.expense_tracker.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fathima.expense_tracker.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin

public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/{email}")

    public Map<String, Object> getReport(
            @PathVariable String email
    ) {

        return reportService
                .generateUserReport(email);
    }
}
