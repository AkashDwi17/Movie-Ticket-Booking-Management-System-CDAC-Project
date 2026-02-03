package com.dac.auth_service.dto;

import com.dac.auth_service.entity.Role;

public record SignupRequest(
        String username,
        String password,
        String role,
        String phone,
        String city,
        String state
) {}
