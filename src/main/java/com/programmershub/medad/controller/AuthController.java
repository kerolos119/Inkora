package com.programmershub.medad.controller;

import com.programmershub.medad.dto.*;
import com.programmershub.medad.services.AuthServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthServices services;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody Credentials credentials){
        return services.login(credentials);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestParam String refreshToken){
        return services.refresh(refreshToken);
    }

    @PostMapping("/logout")
    public String logout(@RequestParam String refreshToken){
        return services.logout(refreshToken);
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody UsersDto usersDto){
        return services.register(usersDto);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgetPasswordRequest forgetPassword){
        return services.forgotPassword(forgetPassword.getEmail());
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        return services.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
    }
}
