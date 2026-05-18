const pool = require('../db');

// Get a patient's health vitals
const getHealthByPatientId = async (patientId) => {
    const result = await pool.query(
        `SELECT * FROM patient_health WHERE patient_id = $1`,
        [patientId]
    );
    return result.rows[0];
};

// Upsert (Insert or Update) the health profile
const upsertHealthProfile = async (data) => {
    const {
        patient_id, height_cm, weight_kg, 
        blood_pressure, bmi, allergies, chronic_conditions
    } = data;

    const result = await pool.query(
        `INSERT INTO patient_health
            (patient_id, height_cm, weight_kg, blood_pressure, bmi, allergies, chronic_conditions)
         VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (patient_id)
         DO UPDATE SET
            height_cm = EXCLUDED.height_cm,
            weight_kg = EXCLUDED.weight_kg,
            blood_pressure = EXCLUDED.blood_pressure,
            bmi = EXCLUDED.bmi,
            allergies = EXCLUDED.allergies,
            chronic_conditions = EXCLUDED.chronic_conditions,
            updated_at = NOW()
         RETURNING *;`,
        [patient_id, height_cm, weight_kg, blood_pressure, bmi, allergies, chronic_conditions]
    );
    return result.rows[0];
};

module.exports = {
    getHealthByPatientId,
    upsertHealthProfile
};