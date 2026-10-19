package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.ShippingSetting;
import com.kerolos119.inkora.dto.ShippingSettingDto;
import com.kerolos119.inkora.repository.ShippingSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ShippingSettingService {

    static final BigDecimal DEFAULT_FEE = new BigDecimal("0.00");
    static final BigDecimal DEFAULT_FREE_THRESHOLD = null;

    private final ShippingSettingRepository repo;

    public ShippingSettingDto get() {
        return repo.findById(ShippingSetting.SINGLETON_ID)
                .map(s -> new ShippingSettingDto(s.getFee(), s.getFreeShippingThreshold()))
                .orElseGet(() -> new ShippingSettingDto(DEFAULT_FEE, DEFAULT_FREE_THRESHOLD));
    }

    public ShippingSettingDto update(ShippingSettingDto dto) {
        ShippingSetting setting = new ShippingSetting(
                ShippingSetting.SINGLETON_ID,
                money(dto.getFee()),
                dto.getFreeShippingThreshold() == null ? null : money(dto.getFreeShippingThreshold()));
                repo.save(setting);
                return get();
    }

    public BigDecimal feeFor(BigDecimal subtotal) {
        ShippingSettingDto s = get();
        if(subtotal.signum() <= 0) {
            return BigDecimal.ZERO.setScale(2);
        }
        if (s.getFreeShippingThreshold() != null && subtotal.compareTo(s.getFreeShippingThreshold()) >= 0) {
            return BigDecimal.ZERO.setScale(2);
        }
        return money(s.getFee());
    }

    private static BigDecimal money(BigDecimal v) {
        return v.setScale(2, RoundingMode.HALF_UP);
    }
}
