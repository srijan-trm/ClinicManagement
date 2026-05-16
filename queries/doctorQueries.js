
const pool = require('../db');

// Get all doctors
const getAllDoctors = async () => {
    const result = await pool.query( `SELECT * FROM doctors ORDER BY doctor_id` );

    return result.rows;
};

// Get single doctor
const getDoctorById = async (id) => {
    const result = await pool.query( `SELECT * FROM doctors WHERE doctor_id = $1`, [id] );

    return result.rows[0];
};

// Create doctor
const createDoctor = async (
    name,
    specialization,
    phone,
    email,
    password
) => {

    const result = await pool.query(
        `INSERT INTO doctors
            (name, specialization, phone, email, password)
         VALUES
            ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
            name,
            specialization,
            phone,
            email,
            password
        ]
    );

    return result.rows[0];
};

// Update doctor
const updateDoctor = async (
    id,
    name,
    specialization,
    phone,
    email
) => {

    const result = await pool.query(
        `UPDATE doctors
         SET name=$1,
             specialization=$2,
             phone=$3,
             email=$4
         WHERE doctor_id=$5
         RETURNING *`,
        [
            name,
            specialization,
            phone,
            email,
            id
        ]
    );

    return result.rows[0];
};

// Delete doctor
const deleteDoctor = async (id) => {

    const result = await pool.query(
        'DELETE FROM doctors WHERE doctor_id = $1 RETURNING *',
        [id]
    );

    return result.rows[0];
};

// Search doctors
const searchDoctors = async (name) => {

    const result = await pool.query(
        `SELECT doctor_id, name, specialization, phone, email
         FROM doctors
         WHERE name ILIKE $1
         ORDER BY name`,
        [`%${name}%`]
    );

    return result.rows;
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors
};

