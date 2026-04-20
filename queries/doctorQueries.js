const pool = require('../db');

// Get all doctors (with department name)
const getAllDoctors = async () => {
    const result = await pool.query(
        `SELECT 
            d.doctor_id,
            d.name,
            d.specialization,
            d.phone,
            d.email,
            d.created_at,
            dept.department_id,
            dept.name AS department_name
         FROM doctors d
         LEFT JOIN departments dept ON d.department_id = dept.department_id
         ORDER BY d.doctor_id`
    );
    return result.rows;
};

// Get a single doctor by ID (with department name)
const getDoctorById = async (id) => {
    const result = await pool.query(
        `SELECT 
            d.doctor_id,
            d.name,
            d.specialization,
            d.phone,
            d.email,
            d.created_at,
            dept.department_id,
            dept.name AS department_name
         FROM doctors d
         LEFT JOIN departments dept ON d.department_id = dept.department_id
         WHERE d.doctor_id = $1`,
        [id]
    );
    return result.rows[0];
};

// Get all doctors by department
const getDoctorsByDepartment = async (department_id) => {
    const result = await pool.query(
        `SELECT 
            d.doctor_id,
            d.name,
            d.specialization,
            d.phone,
            d.email,
            dept.name AS department_name
         FROM doctors d
         LEFT JOIN departments dept ON d.department_id = dept.department_id
         WHERE d.department_id = $1
         ORDER BY d.name`,
        [department_id]
    );
    return result.rows;
};

// Create a new doctor
const createDoctor = async (name, department_id, specialization, phone, email) => {
    const result = await pool.query(
        `INSERT INTO doctors (name, department_id, specialization, phone, email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, department_id, specialization, phone, email]
    );
    return result.rows[0];
};

// Update a doctor
const updateDoctor = async (id, name, department_id, specialization, phone, email) => {
    const result = await pool.query(
        `UPDATE doctors 
         SET name=$1, department_id=$2, specialization=$3, phone=$4, email=$5
         WHERE doctor_id=$6
         RETURNING *`,
        [name, department_id, specialization, phone, email, id]
    );
    return result.rows[0];
};

// Delete a doctor
const deleteDoctor = async (id) => {
    const result = await pool.query(
        'DELETE FROM doctors WHERE doctor_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Search doctors by name
const searchDoctors = async (name) => {
    const result = await pool.query(
        `SELECT 
            d.doctor_id,
            d.name,
            d.specialization,
            d.phone,
            dept.name AS department_name
         FROM doctors d
         LEFT JOIN departments dept ON d.department_id = dept.department_id
         WHERE d.name ILIKE $1
         ORDER BY d.name`,
        [`%${name}%`]
    );
    return result.rows;
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    getDoctorsByDepartment,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors
};