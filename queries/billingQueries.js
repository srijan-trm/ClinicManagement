const pool = require('../db');

// 1. Generate an invoice (Calculates Fee + Medicines)
const generateInvoice = async (appointment_id, consultation_fee = 50.00) => {
    const result = await pool.query(
        `WITH MedicineCosts AS (
            SELECT p.appointment_id, SUM(m.price * p.quantity) as meds_total
            FROM prescriptions p
            JOIN medicines m ON p.medicine_id = m.medicine_id
            WHERE p.appointment_id = $1
            GROUP BY p.appointment_id
        )
        INSERT INTO billing (appointment_id, consultation_fee, total_amount)
        SELECT 
            $1, 
            $2, 
            ($2 + COALESCE((SELECT meds_total FROM MedicineCosts), 0))
        RETURNING *;`,
        [appointment_id, consultation_fee]
    );
    return result.rows[0];
};

// 2. Get all invoices (Joined with patient names for the UI)
const getAllInvoices = async () => {
    const result = await pool.query(
        `SELECT b.*, p.name AS patient_name, a.appointment_date 
         FROM billing b
         JOIN appointments a ON b.appointment_id = a.appointment_id
         JOIN patients p ON a.patient_id = p.patient_id
         ORDER BY b.issued_at DESC`
    );
    return result.rows;
};

// 3. Mark an invoice as Paid
const updatePaymentStatus = async (invoice_id, status) => {
    const result = await pool.query(
        `UPDATE billing 
         SET payment_status = $1 
         WHERE invoice_id = $2 
         RETURNING *`,
        [status, invoice_id]
    );
    return result.rows[0];
};

module.exports = { generateInvoice, getAllInvoices, updatePaymentStatus };