package com.dac.Show.service.dto;


import lombok.Data;

@Data
public class TheatreResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String screenType;
    private Integer totalSeats;
}
