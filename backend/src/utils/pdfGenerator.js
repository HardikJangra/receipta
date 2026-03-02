const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${invoice._id}.pdf`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.moveDown();

  // Client Info
  doc.fontSize(12).text(`Client: ${invoice.clientName}`);
  doc.text(`Email: ${invoice.clientEmail}`);
  doc.text(`Status: ${invoice.status}`);
  doc.moveDown();

  // Items
  doc.text('Items:', { underline: true });
  invoice.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price}`
    );
  });

  doc.moveDown();

  // Totals
  doc.text(`Subtotal: ₹${invoice.subtotal}`);
  doc.text(`Tax: ${invoice.tax}%`);
  doc.fontSize(14).text(`Total: ₹${invoice.total}`);

  doc.end();
};

module.exports = generateInvoicePDF;