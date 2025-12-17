import PDFDocument from 'pdfkit';

export const generateBookingPdf = (bookingDetails) => { // Removed 'stream' parameter
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(28)
     .font('Helvetica-Bold')
     .fillColor('#333')
     .text('BusGo - Bus Ticket Confirmation', { align: 'center' });
  doc.moveDown(1.5);

  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#555')
     .text('Booking Details:', { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('#666')
     .text(`Booking ID: ${bookingDetails._id}`);
  doc.text(`User Name: ${bookingDetails.userName}`);
  doc.text(`User Email: ${bookingDetails.userEmail}`);
  doc.text(`Bus Name: ${bookingDetails.busName}`);
  doc.text(`Route: ${bookingDetails.busRoute}`); // Assuming 'busRoute' in bookingDetails
  doc.text(`Departure Time: ${bookingDetails.busDepartureTime}`); // Assuming 'busDepartureTime'
  doc.text(`Booking Date: ${new Date(bookingDetails.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#555')
     .text('Ticket Information:', { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('#666')
     .text(`Booked Seat No: ${bookingDetails.seats.join(', ')}`);
  doc.text(`Total Amount: Rs. ${bookingDetails.amount.toFixed(2)}`);
  doc.text(`Payment Status: ${bookingDetails.paymentStatus.charAt(0).toUpperCase() + bookingDetails.paymentStatus.slice(1)}`);
  doc.text(`Booking Status: ${bookingDetails.status.charAt(0).toUpperCase() + bookingDetails.status.slice(1)}`);
  doc.moveDown();

  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#555')
     .text('Departure Location:', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('#666')
     .text(`Address: ${bookingDetails.location.address}`);
  doc.moveDown(2);

  doc.fontSize(10)
     .fillColor('#888')
     .text('Thank you for booking with us! Please carry this confirmation with you.', { align: 'center' });

  doc.end(); // Finalize the PDF and trigger 'data' and 'end' events
  return doc; // Return the PDFDocument instance
};