package com.programmershub.medad.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {

    private final HttpStatus status;

    public CustomException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status == null ? HttpStatus.BAD_REQUEST : status;
    }

}