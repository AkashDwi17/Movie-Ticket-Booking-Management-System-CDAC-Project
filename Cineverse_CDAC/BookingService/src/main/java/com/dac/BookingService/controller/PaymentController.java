package com.dac.BookingService.controller;

import com.dac.BookingService.dto.BookingRequest;
import com.dac.BookingService.dto.BookingResponse;
import com.dac.BookingService.dto.CreatePaymentRequest;
import com.dac.BookingService.model.Booking;
import com.dac.BookingService.repository.BookingRepository;
import com.dac.BookingService.service.BookingService;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    //  STRIPE → CONFIRM BOOKING AFTER PAYMENT
    @PostMapping("/confirm-session")
    public BookingResponse confirmAfterStripeSession(@RequestBody Map<String, String> body) throws Exception {

        String sessionId = body.get("sessionId");
        String authHeader = body.get("authHeader");

        Stripe.apiKey = stripeSecretKey;

        Session session = Session.retrieve(sessionId);

        Long userId = Long.valueOf(session.getMetadata().get("userId"));
        Long showId = Long.valueOf(session.getMetadata().get("showId"));
        String seats = session.getMetadata().get("seats");

        //  IDEMPOTENCY: if this booking already exists, don't create/send again
        Optional<Booking> existing = bookingRepository
                .findByUserIdAndShowIdAndSeats(userId, showId, seats);

        if (existing.isPresent()) {
            System.out.println("⚠ Duplicate Stripe callback detected — returning existing booking");
            BookingResponse resp = bookingService.getBookingById(existing.get().getId());
            resp.setMovieName(session.getMetadata().getOrDefault("movieName", ""));
            resp.setShowTime(session.getMetadata().getOrDefault("showTime", ""));
            return resp;
        }

        Integer amount = session.getAmountTotal().intValue() / 100;

        BookingRequest req = new BookingRequest();
        req.setUserId(userId);
        req.setShowId(showId);
        req.setAmount(amount.doubleValue());
        req.setSeatNumbers(Arrays.asList(seats.split(",")));

        req.setUserName(session.getMetadata().getOrDefault("userName", ""));
        req.setUserPhone(session.getMetadata().getOrDefault("userPhone", ""));
        req.setMovieName(session.getMetadata().getOrDefault("movieName", ""));
        req.setShowTime(session.getMetadata().getOrDefault("showTime", ""));

        req.setAuthHeader(authHeader);

        return bookingService.createBooking(req);
    }

    //  STRIPE CHECKOUT SESSION
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(
            @RequestBody CreatePaymentRequest req) throws Exception {

        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(successUrl + "/?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl(cancelUrl)

                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("inr")
                                                        .setUnitAmount(req.getAmount() * 100L)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData
                                                                        .builder()
                                                                        .setName("Movie Ticket Booking")
                                                                        .build()
                                                        )
                                                        .build())
                                        .build()
                        )

                        .putMetadata("userId", req.getUserId().toString())
                        .putMetadata("showId", req.getShowId().toString())
                        .putMetadata("seats", String.join(",", req.getSeats()))
                        .putMetadata("userName", req.getUserName() != null ? req.getUserName() : "")
                        .putMetadata("userPhone", req.getUserPhone() != null ? req.getUserPhone() : "")
                        .putMetadata("movieName", req.getMovieName() != null ? req.getMovieName() : "")
                        .putMetadata("showTime", req.getShowTime() != null ? req.getShowTime() : "")

                        .build();

        Session session = Session.create(params);

        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());

        return ResponseEntity.ok(response);
    }
}
