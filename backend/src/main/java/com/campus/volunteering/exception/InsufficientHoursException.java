package com.campus.volunteering.exception;

public class InsufficientHoursException extends RuntimeException {
    public InsufficientHoursException(String message) {
        super(message);
    }
}
