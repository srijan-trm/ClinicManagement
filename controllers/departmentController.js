const {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../queries/departmentQueries');

const getAll = async (req, res) => {
    try {
        const departments = await getAllDepartments();
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const department = await getDepartmentById(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        const department = await createDepartment(name, description);
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = await updateDepartment(req.params.id, name, description);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const department = await deleteDepartment(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted', department });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };