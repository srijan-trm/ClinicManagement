const {
    getPrescriptionsByAppointment,
    getAllPrescriptions,
    createPrescription,
    deletePrescription
} = require('../queries/prescriptionQueries');

const getByAppointment = async (req, res) => {
    try {
        const prescriptions = await getPrescriptionsByAppointment(req.params.appointmentId);
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAll = async (req, res) => {
    try {
        const prescriptions = await getAllPrescriptions();
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { appointment_id, medicine_id, dosage, duration_days, quantity } = req.body;
        
        if (!appointment_id || !medicine_id || !quantity) {
            return res.status(400).json({ error: 'Appointment ID, Medicine ID, and Quantity are required' });
        }

        const prescription = await createPrescription(appointment_id, medicine_id, dosage, duration_days, quantity);
        res.status(201).json(prescription);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Invalid Appointment ID or Medicine ID' });
        }
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const prescription = await deletePrescription(req.params.id);
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.status(200).json({ message: 'Prescription deleted', prescription });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll,getByAppointment, create, remove };