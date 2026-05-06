const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
} = require('../queries/appointmentQueries');

const getAll = async (req, res) => {
    try {
        const appointments = await getAllAppointments();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const appointment = await getAppointmentById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, status, notes } = req.body;
        
        if (!patient_id || !doctor_id || !appointment_date) {
            return res.status(400).json({ error: 'Patient ID, Doctor ID, and Date are required' });
        }

        const appointment = await createAppointment(patient_id, doctor_id, appointment_date, status, notes);
        res.status(201).json(appointment);
    } catch (err) {
        // Handle foreign key constraint errors (e.g., patient or doctor doesn't exist)
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Invalid Patient ID or Doctor ID' });
        }
        res.status(500).json({ error: err.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const appointment = await updateAppointmentStatus(req.params.id, status);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const appointment = await deleteAppointment(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted', appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, updateStatus, remove };