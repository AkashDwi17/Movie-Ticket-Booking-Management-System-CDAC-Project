package com.dac.BookingService.service;


import com.dac.BookingService.dto.BookingRequest;
import com.dac.BookingService.dto.ShowDTO;
import com.dac.BookingService.model.Booking;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class TicketPdfService {

    public byte[] generateTicketPdf(Booking booking, BookingRequest request, ShowDTO show) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, baos);

        doc.open();

        Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 12);

        doc.add(new Paragraph("CineVerse - Movie Ticket", titleFont));
        doc.add(new Paragraph(" ", normalFont));

        doc.add(new Paragraph("Thank you for booking with us!", normalFont));
        doc.add(new Paragraph(" ", normalFont));

        doc.add(new Paragraph("Booking Details", new Font(Font.HELVETICA, 14, Font.BOLD)));
        doc.add(new Paragraph(" ", normalFont));

        doc.add(new Paragraph("Booking ID : " + booking.getId(), normalFont));
        doc.add(new Paragraph("User       : " + (request.getUserName() != null ? request.getUserName() : "User"), normalFont));
        doc.add(new Paragraph("Movie      : " + (request.getMovieName() != null ? request.getMovieName() : "N/A"), normalFont));
        doc.add(new Paragraph("Show Time  : " + (request.getShowTime() != null ? request.getShowTime() : "N/A"), normalFont));
        doc.add(new Paragraph("Seats      : " + booking.getSeats(), normalFont));
        doc.add(new Paragraph("Amount     : ₹" + booking.getAmount(), normalFont));
        doc.add(new Paragraph("Theatre ID : " + booking.getTheatreId(), normalFont));
        doc.add(new Paragraph(" ", normalFont));

        doc.add(new Paragraph("Please reach the theatre 15 minutes before showtime.", normalFont));
        doc.add(new Paragraph("CineVerse | This is a computer generated ticket.", normalFont));

        doc.close();

        return baos.toByteArray();
    }
}
