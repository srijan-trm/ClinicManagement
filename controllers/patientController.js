const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
} = require('../queries/patientQueries');

const getAll = async (req, res) => {
    try {
        // if a search query is passed e.g. /api/patients?search=raj
        if (req.query.search) {
            const patients = await searchPatients(req.query.search);
            return res.status(200).json(patients);
        }
        const patients = await getAllPatients();
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const patient = await getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, gender, date_of_birth, blood_group, phone, email, address } = req.body;
        // validate required fields
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }
        const patient = await createPatient(name, gender, date_of_birth, blood_group, phone, email, address);
        res.status(201).json(patient);
    } catch (err) {
        // handle duplicate phone/email
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Phone or email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { name, gender, date_of_birth, blood_group, phone, email, address } = req.body;
        const patient = await updatePatient(req.params.id, name, gender, date_of_birth, blood_group, phone, email, address);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Phone or email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const patient = await deletePatient(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted', patient });
    } catch (err) {
        // handle case where patient has appointments
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Cannot delete patient with existing appointments' });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };