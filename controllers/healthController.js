const {
    getHealthByPatientId,
    upsertHealthProfile
} = require('../queries/healthQueries');
const pool = require('../db'); 

const getPatientHealth = async (req, res) => {
    try {
        const patientId = req.params.id;
        const health = await getHealthByPatientId(patientId);
        
        // Fetch the corresponding blood group value directly from the patient record layout
        const patientRecord = await pool.query("SELECT blood_group FROM patients WHERE patient_id = $1", [patientId]);
        
        let packagedData = health || {};
        if (patientRecord.rows.length > 0) {
            packagedData.blood_group = patientRecord.rows[0].blood_group;
        }

        res.json(packagedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch health profile parameters' });
    }
};

const savePatientHealth = async (req, res) => {
    try {
        const patient_id = req.body.patient_id;
        const { height_cm, weight_kg, blood_pressure, bmi, allergies, chronic_conditions, blood_group } = req.body;

        // 1. Process standard body metrics within the health profile table layout
        const result = await upsertHealthProfile({
            patient_id,
            height_cm: height_cm || null,
            weight_kg: weight_kg || null,
            blood_pressure: blood_pressure || null,
            bmi: bmi || null,
            allergies: allergies || null,
            chronic_conditions: chronic_conditions || null
        });

        // 2. Persist updated Blood Group characteristics straight into the primary patient data matrix
        if (blood_group) {
            await pool.query(
                "UPDATE patients SET blood_group = $1 WHERE patient_id = $2",
                [blood_group, patient_id]
            );
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to preserve updated health summary' });
    }
};

module.exports = { getPatientHealth, savePatientHealth };