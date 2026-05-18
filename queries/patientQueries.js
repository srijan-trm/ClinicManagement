const pool = require('../db');

// Get all patients
const getAllPatients = async () => {
    const result = await pool.query(
        'SELECT * FROM patients ORDER BY patient_id ASC'
    );
    return result.rows;
};

// Get a single patient by ID
const getPatientById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM patients WHERE patient_id = $1',
        [id]
    );
    return result.rows[0];
};

// Create a new patient (with login credentials and health details)
const createPatient = async (name, gender, date_of_birth, blood_group, phone, email, address, password) => {
    const result = await pool.query(
        `INSERT INTO patients
            (name, gender, date_of_birth, blood_group, phone, email, address, password)
         VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, gender, date_of_birth, blood_group, phone, email, address, password]
    );
    return result.rows[0];
};

// Update an existing patient
const updatePatient = async (id, name, gender, date_of_birth, blood_group, phone, email, address) => {
    const result = await pool.query(
        `UPDATE patients 
         SET name=$1, gender=$2, date_of_birth=$3, blood_group=$4, phone=$5, email=$6, address=$7 
         WHERE patient_id=$8 
         RETURNING *`,
        [name, gender, date_of_birth, blood_group, phone, email, address, id]
    );
    return result.rows[0];
};

// Delete a patient
const deletePatient = async (id) => {
    const result = await pool.query(
        'DELETE FROM patients WHERE patient_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Search patients by name
const searchPatients = async (name) => {
    const result = await pool.query(
        'SELECT * FROM patients WHERE name ILIKE $1 ORDER BY name',
        [`%${name}%`]
    );
    return result.rows;
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
};