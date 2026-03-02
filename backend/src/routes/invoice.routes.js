const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  downloadInvoicePDF
} = require('../controllers/invoice.controller');

router.use(authMiddleware);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.get('/:id/pdf', downloadInvoicePDF);
router.put('/:id', updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

module.exports = router;