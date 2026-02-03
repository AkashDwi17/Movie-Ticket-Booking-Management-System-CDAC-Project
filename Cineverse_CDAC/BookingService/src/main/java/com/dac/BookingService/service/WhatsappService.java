package com.dac.BookingService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class WhatsappService {

    @Value("${whatsapp.phone-id}")
    private String phoneNumberId;

    @Value("${whatsapp.token}")
    private String whatsappToken;

    @Qualifier("externalWebClient")
    private final WebClient whatsappClient;

    private String cleanNumber(String number) {
        if (number == null) return null;
        return number.replace("+", "").replace(" ", "").trim();
    }

    // SEND TEMPLATE MESSAGE
    public Mono<String> sendBookingTicket(
            String toNumber,
            String user,
            String movie,
            String time,
            String seats,
            String bookingId
    ) {
        toNumber = cleanNumber(toNumber);

        String endpoint =
                "https://graph.facebook.com/v24.0/" + phoneNumberId + "/messages";

        String body = """
                {
                  "messaging_product": "whatsapp",
                  "to": "%s",
                  "type": "template",
                  "template": {
                    "name": "ticket_confirm",
                    "language": { "code": "en" },
                    "components": [
                      {
                        "type": "body",
                        "parameters": [
                          { "type": "text", "text": "%s" },
                          { "type": "text", "text": "%s" },
                          { "type": "text", "text": "%s" },
                          { "type": "text", "text": "%s" },
                          { "type": "text", "text": "%s" }
                        ]
                      }
                    ]
                  }
                }
                """.formatted(toNumber, user, movie, time, seats, bookingId);

        System.out.println("Endpoint  : " + endpoint);
        System.out.println("To Number : " + toNumber);
        System.out.println("Body      : " + body);

        return whatsappClient.post()
                .uri(endpoint)
                .header("Authorization", "Bearer " + whatsappToken)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class);
    }

    //  SEND PDF DOCUMENT
    public Mono<String> sendTicketPdf(String toNumber, byte[] pdfBytes, String filename) {

        final String finalNumber = cleanNumber(toNumber);

        String uploadEndpoint =
                "https://graph.facebook.com/v24.0/" + phoneNumberId + "/media";

        MultipartBodyBuilder builder = new MultipartBodyBuilder();


        builder.part("messaging_product", "whatsapp");

        builder.part("file", pdfBytes)
                .filename(filename)
                .contentType(MediaType.APPLICATION_PDF);

        builder.part("type", "application/pdf");

        System.out.println("Endpoint  : " + uploadEndpoint);
        System.out.println("To Number : " + finalNumber);
        System.out.println("File Name : " + filename);
        System.out.println("PDF Size  : " + (pdfBytes != null ? pdfBytes.length : 0) + " bytes");

        ObjectMapper objectMapper = new ObjectMapper();

        //  Upload the PDF
        return whatsappClient.post()
                .uri(uploadEndpoint)
                .header("Authorization", "Bearer " + whatsappToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(resp -> {
                    try {
                        JsonNode node = objectMapper.readTree(resp);
                        String mediaId = node.get("id").asText();

                        System.out.println("✅ Uploaded PDF mediaId = " + mediaId);

                        //Send WhatsApp message with the uploaded mediaId
                        String msgEndpoint =
                                "https://graph.facebook.com/v24.0/" + phoneNumberId + "/messages";

                        String body = """
                                {
                                  "messaging_product": "whatsapp",
                                  "to": "%s",
                                  "type": "document",
                                  "document": {
                                    "id": "%s",
                                    "filename": "%s",
                                    "caption": "Your CineVerse Ticket "
                                  }
                                }
                                """.formatted(finalNumber, mediaId, filename);

                        System.out.println("Endpoint  : " + msgEndpoint);
                        System.out.println("To Number : " + finalNumber);
                        System.out.println("Body      : " + body);

                        return whatsappClient.post()
                                .uri(msgEndpoint)
                                .header("Authorization", "Bearer " + whatsappToken)
                                .header("Content-Type", "application/json")
                                .bodyValue(body)
                                .retrieve()
                                .bodyToMono(String.class);

                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                });
    }
}
