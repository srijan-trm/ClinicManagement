const pool = require('../db');

// Get all appointments with patient and doctor names
const getAllAppointments = async () => {
    const result = await pool.query(
        `SELECT 
            a.appointment_id, a.appointment_date, a.status, a.notes,
            p.name AS patient_name, p.phone AS patient_phone,
            d.name AS doctor_name, d.specialization
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         JOIN doctors d ON a.doctor_id = d.doctor_id
         ORDER BY a.appointment_date DESC`
    );
    return result.rows;
};

// Get a single appointment by ID
const getAppointmentById = async (id) => {
    const result = await pool.query(
        `SELECT a.*, p.name AS patient_name, d.name AS doctor_name
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         JOIN doctors d ON a.doctor_id = d.doctor_id
         WHERE a.appointment_id = $1`,
        [id]
    );
    return result.rows[0];
};

// Create a new appointment
const createAppointment = async (
    patient_id,
    doctor_id,
    appointment_date,
    status = 'Scheduled',
    notes = ''
) => {

    // Check if slot already exists
    const existing = await pool.query(

        `
        SELECT *
        FROM appointments
        WHERE doctor_id = $1
        AND appointment_date = $2
        `,

        [doctor_id, appointment_date]
    );

    if (existing.rows.length > 0) {

        throw new Error('Doctor already has appointment at this time');

    }

    // Insert appointment
    const result = await pool.query(

        `
        INSERT INTO appointments
        (
            patient_id,
            doctor_id,
            appointment_date,
            status,
            notes
        )

        VALUES ($1, $2, $3, $4, $5)

        RETURNING *
        `,

        [
            patient_id,
            doctor_id,
            appointment_date,
            status,
            notes
        ]
    );

    return result.rows[0];
};

// Update an appointment's status (e.g., 'Completed', 'Cancelled')
const updateAppointmentStatus = async (id, status) => {
    const result = await pool.query(
        `UPDATE appointments 
         SET status = $1 
         WHERE appointment_id = $2 
         RETURNING *`,
        [status, id]
    );
    return result.rows[0];
};

// Delete an appointment
const deleteAppointment = async (id) => {
    const result = await pool.query(
        'DELETE FROM appointments WHERE appointment_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
};