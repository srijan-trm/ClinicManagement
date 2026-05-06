const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors
} = require('../queries/doctorQueries');

const getAll = async (req, res) => {
    try {
        // search: /api/doctors?search=meera
        if (req.query.search) {
            const doctors = await searchDoctors(req.query.search);
            return res.status(200).json(doctors);
        }
        
        const doctors = await getAllDoctors();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const doctor = await getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        // Removed department_id from destructuring
        const { name, specialization, phone, email } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }
        
        // Pass updated parameters to the query
        const doctor = await createDoctor(name, specialization, phone, email);
        res.status(201).json(doctor);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Phone or email already exists' });
        }
        // Removed the 23503 check since departments are no longer a foreign key here
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        // Removed department_id from destructuring
        const { name, specialization, phone, email } = req.body;
        
        // Pass updated parameters to the query
        const doctor = await updateDoctor(req.params.id, name, specialization, phone, email);
        
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Phone or email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const doctor = await deleteDoctor(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted', doctor });
    } catch (err) {
        // Kept this 23503 check because it protects against deleting doctors who are tied to existing appointments or schedules
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Cannot delete doctor with existing appointments or schedules' });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };