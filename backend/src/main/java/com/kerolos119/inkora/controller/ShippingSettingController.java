package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.ShippingSettingDto;
import com.kerolos119.inkora.services.ShippingSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/setting/shipping")
@RequiredArgsConstructor
public class ShippingSettingController {

    private final ShippingSettingService service;

    @GetMapping
    public ShippingSettingDto get() {
        return service.get();
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ShippingSettingDto update(@Valid @RequestBody ShippingSettingDto dto) {
        return service.update(dto);
    }
}
