package com.kerolos119.inkora.Utils;

import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

public class OtpCache {

    private OtpCache(){}

    private record OtpEntry(String otp, Instant expired, int attempts){}

    private static final ConcurrentHashMap<String, OtpEntry> cache = new ConcurrentHashMap<>();

    private static boolean isActive(String email){
        OtpEntry entry = cache.get(email);
        if (entry == null)
            return false;
        if (Instant.now().isAfter(entry.expired())) {
            cache.remove(email);
            return false;
        }
        return true;
    }

    public static void store(String email, String  otp){
        if (isActive(email)){
            throw new CustomException(ExceptionMessage.OTP_ALREADY_SENT);
        }
        cache.put(email, new OtpEntry(otp, Instant.now().plusSeconds(600), 0));
    }

    public static void validate(String email, String otp){
        OtpEntry entry = cache.get(email);

        if (entry == null) {
            throw new CustomException(ExceptionMessage.INVALID_OTP);
        }

        if (Instant.now().isAfter(entry.expired())){
            cache.remove(email);
            throw new CustomException(ExceptionMessage.OTP_EXPIRED);
        }

        if (entry.attempts() >= 5){
            cache.remove(email);
            throw new CustomException(ExceptionMessage.OTP_MAX_ATTEMPTS);
        }

        if (!entry.otp().equals(otp)){
            cache.put(email, new OtpEntry(entry.otp(), entry.expired(), entry.attempts() + 1));
            throw new CustomException(ExceptionMessage.INVALID_OTP);
        }

    }

    public static void invalidate(String email){
        cache.remove(email);
    }

    public static void evictExpired(){
        Instant instant = Instant.now();
        cache.entrySet().removeIf(entry -> instant.isAfter(entry.getValue().expired()));
    }

}
