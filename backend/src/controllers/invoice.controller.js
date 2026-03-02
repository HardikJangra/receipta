const Invoice = require('../models/Invoice');
const generateInvoicePDF = require('../utils/pdfGenerator');

// CREATE
exports.createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, items, tax, dueDate } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.quantity * item.price;
    });

    const total = subtotal + (subtotal * (tax || 0)) / 100;

    const invoice = await Invoice.create({
      userId: req.user._id,
      clientName,
      clientEmail,
      items,
      tax,
      subtotal,
      total,
      dueDate
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Create invoice failed' });
  }
};

// GET ALL
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Fetch invoices failed' });
  }
};

// GET ONE
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Fetch invoice failed' });
  }
};

// UPDATE (PUT)
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Paid invoice cannot be edited' });
    }

    Object.assign(invoice, req.body);
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// DELETE
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft invoices can be deleted' });
    }

    await invoice.deleteOne();
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// STATUS UPDATE (PATCH)
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Paid invoice cannot change' });
    }

    if (
      (invoice.status === 'draft' && status !== 'pending') ||
      (invoice.status === 'pending' && status !== 'paid')
    ) {
      return res.status(400).json({ message: 'Invalid transition' });
    }

    invoice.status = status;
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Status update failed' });
  }
};
// DOWNLOAD INVOICE PDF
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    generateInvoicePDF(invoice, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};