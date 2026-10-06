package com.kerolos119.inkora.services;

import com.kerolos119.inkora.Utils.JWTUtils;
import com.kerolos119.inkora.Utils.OtpCache;
import com.kerolos119.inkora.document.RefreshToken;
import com.kerolos119.inkora.document.Users;
import com.kerolos119.inkora.dto.Credentials;
import com.kerolos119.inkora.dto.LoginResponse;
import com.kerolos119.inkora.dto.UsersDto;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.UsersMapper;
import com.kerolos119.inkora.model.EmailMessages;
import com.kerolos119.inkora.model.Role;
import com.kerolos119.inkora.repository.RefreshTokenRepository;
import com.kerolos119.inkora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServices {
    
    private final UserRepository repo;
    private final UsersMapper mapper;
    private final EmailServices emailServices;
    private final EmailMessages emailMessages;
    private final JWTUtils jwtUtils;
    private final PasswordEncoder encoder;
    private final RefreshTokenRepository refreshTokenRepo;
    private final SecureRandom random = new SecureRandom();

    public LoginResponse login(Credentials credentials) {
        Users users = repo.findByEmail(credentials.getEmail())
                .orElseThrow(() -> new CustomException(ExceptionMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED));

        if (!encoder.matches(credentials.getPassword(), users.getPassword())) {
            throw new CustomException(ExceptionMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtUtils.generateToken(users);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setId(UUID.randomUUID().toString());
        refreshToken.setUserId(users.getId());
        refreshToken.setExpiresAt(Instant.now().plusSeconds(604800));
        refreshToken.setRevoked(false);
        refreshTokenRepo.save(refreshToken);

        return new LoginResponse(accessToken, refreshToken.getId());
    }

    public LoginResponse refresh(String refreshTokenId){
        RefreshToken old = refreshTokenRepo.findByIdAndRevokedFalse(refreshTokenId)
                .orElseThrow(() -> new CustomException(ExceptionMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED));

        if (old.getExpiresAt().isBefore(Instant.now())){
            refreshTokenRepo.delete(old);
            throw new CustomException(ExceptionMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        Users user = repo.findById(old.getUserId())
                .orElseThrow(() -> new CustomException(ExceptionMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND));

        old.setRevoked(true);
        refreshTokenRepo.save(old);

        RefreshToken newRT = new RefreshToken();
        newRT.setId(UUID.randomUUID().toString());
        newRT.setUserId(user.getId());
        newRT.setExpiresAt(Instant.now().plusSeconds(604800));
        newRT.setRevoked(false);
        refreshTokenRepo.save(newRT);

        return new LoginResponse(jwtUtils.generateToken(user),newRT.getId());
    }

    public String logout(String refreshTokenId) {
        refreshTokenRepo.findByIdAndRevokedFalse(refreshTokenId).ifPresent( rf ->{
            rf.setRevoked(true);
            refreshTokenRepo.save(rf);
        });
        return "Logged out";
    }

    public String register(UsersDto usersDto) {
        if (repo.existsByEmail(usersDto.getEmail()) ||
                repo.existsByUsername(usersDto.getUsername()) ||
                repo.existsByPhoneNumber(usersDto.getPhoneNumber())){
            throw new CustomException(ExceptionMessage.USER_EXISTS);
        }

        Users users = mapper.toEntity(usersDto);
        users.setRole(Role.USER);
        users.setPassword(encoder.encode(usersDto.getPassword()));
        repo.save(users);

        emailServices.sendHtmlMail(users.getEmail(), emailMessages.welcome(users.getUsername()));

        return "Registration successful";
    }

    public String forgotPassword(String email) {
        Optional<Users> userOtp = repo.findByEmail(email);
        if (userOtp.isPresent()) {
            String otp = String.format("%06d", random.nextInt(1_000_000));
            OtpCache.store(email, otp);
            emailServices.sendHtmlMail(email, emailMessages.otp(userOtp.get().getUsername(), otp));
        }

        return "If the email is registered, an OTP has been sent";
    }

    public String resetPassword(String email, String otp, String newPassword) {
        Users users = repo.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionMessage.USER_NOT_FOUND));

        OtpCache.validate(email, otp);

        users.setPassword(encoder.encode(newPassword));
        repo.save(users);

        OtpCache.invalidate(email);

        return "Password reset successfully";
    }

}
