const pool = require('../db');

// Get all prescriptions for a specific appointment
const getPrescriptionsByAppointment = async (appointment_id) => {
    const result = await pool.query(
        `SELECT 
            p.prescription_id, p.dosage, p.duration_days, p.quantity,
            m.medicine_id, m.name AS medicine_name, m.unit
         FROM prescriptions p
         JOIN medicines m ON p.medicine_id = m.medicine_id
         WHERE p.appointment_id = $1`,
        [appointment_id]
    );
    return result.rows;
};

const getAllPrescriptions = async () => {
    const result = await pool.query(
        `SELECT 
            p.prescription_id, p.dosage, p.duration_days, p.quantity,
            a.appointment_date,
            m.name AS medicine_name
         FROM prescriptions p
         JOIN appointments a ON p.appointment_id = a.appointment_id
         JOIN medicines m ON p.medicine_id = m.medicine_id
         ORDER BY a.appointment_date DESC`
    );
    return result.rows;
};

// Add a new prescription to an appointment
const createPrescription = async (appointment_id, medicine_id, dosage, duration_days, quantity) => {
    const result = await pool.query(
        `INSERT INTO prescriptions (appointment_id, medicine_id, dosage, duration_days, quantity)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [appointment_id, medicine_id, dosage, duration_days, quantity]
    );
    return result.rows[0];
};

// Remove a prescription
const deletePrescription = async (id) => {
    const result = await pool.query(
        'DELETE FROM prescriptions WHERE prescription_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAllPrescriptions,
    getPrescriptionsByAppointment,
    createPrescription,
    deletePrescription
};