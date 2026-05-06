const {
    getAllMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicine
} = require('../queries/medicineQueries');

const getAll = async (req, res) => {
    try {
        if (req.query.search) {
            const medicines = await searchMedicines(req.query.search);
            return res.status(200).json(medicines);
        }
        const medicines = await getAllMedicines();
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const medicine = await getMedicineById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, category, unit, price, stock } = req.body;
        
        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({ error: 'Name, price, and stock are required' });
        }

        const medicine = await createMedicine(name, category, unit, price, stock);
        res.status(201).json(medicine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { name, category, unit, price, stock } = req.body;
        const medicine = await updateMedicine(req.params.id, name, category, unit, price, stock);
        
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const medicine = await deleteMedicine(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted', medicine });
    } catch (err) {
        // Protects against deleting a medicine that is actively linked to a prescription
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Cannot delete medicine used in existing prescriptions' });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };