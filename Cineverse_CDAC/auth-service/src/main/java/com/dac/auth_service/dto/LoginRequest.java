package com.dac.auth_service.dto;

public record LoginRequest(
        String username,
        String password
) {}
