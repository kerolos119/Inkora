package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.CustomerDto;
import com.kerolos119.inkora.dto.DashboardDto;
import com.kerolos119.inkora.services.DashboardServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardServices services;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardDto getDashboard() {
        return services.getDashboard();
    }

    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CustomerDto> getCustomer() {
        return services.getCustomers();
    }
}
