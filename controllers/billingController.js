const { generateInvoice, getAllInvoices, updatePaymentStatus } = require('../queries/billingQueries');

const createInvoice = async (req, res) => {
    try {
        const { appointment_id, consultation_fee } = req.body;
        if (!appointment_id) return res.status(400).json({ error: 'appointment_id is required' });

        const invoice = await generateInvoice(appointment_id, consultation_fee);
        res.status(201).json(invoice);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Invoice already exists for this appointment' });
        res.status(500).json({ error: err.message });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await getAllInvoices();
        res.status(200).json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const payInvoice = async (req, res) => {
    try {
        const { status } = req.body; // e.g., "Paid"
        const invoice = await updatePaymentStatus(req.params.id, status);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createInvoice, getInvoices, payInvoice };