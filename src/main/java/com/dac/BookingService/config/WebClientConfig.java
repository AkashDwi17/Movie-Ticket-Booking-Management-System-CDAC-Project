package com.dac.BookingService.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${spring.application.name}")
    private String appName;

    //  Used ONLY for external APIs (WhatsApp)
    @Bean(name = "externalWebClient")
    public WebClient externalWebClient() {
        return WebClient.builder()
                .defaultHeader("X-Service-Name", appName)
                .build();
    }

    //  LoadBalanced WebClient ONLY for microservices
    @Bean(name = "internalWebClient")
    @LoadBalanced
    public WebClient.Builder internalWebClientBuilder() {
        return WebClient.builder()
                .defaultHeader("X-Service-Name", appName);
    }
}
