const pool = require('../db');

const getAllDepartments = async () => {
    const result = await pool.query('SELECT * FROM departments ORDER BY department_id');
    return result.rows;
}

const getDepartmentByID = async (id) => {
    const result = await pool.query('SELECT * FROM departments WHERE department_id = $1',[id]);
    return result.rows[0];    
}

const createDepartment = async (name, description) => {
    const result = await pool.query('INSERT INTO department (name, description) VALUES ($1,$2) RETURNING *',[name, description]);
    return result.rows[0];    
}

const updateDepartment = async (id, name, description) => {
    const result = await pool.query(
        'UPDATE departments SET name = $1, description = $2 WHERE department_id = $3 RETURNING *',
        [name, description, id]
    );
    return result.rows[0];
};

const deleteDepartment = async (id) => {
    const result = await pool.query(
        'DELETE FROM departments WHERE department_id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    createDepartment,
    getDepartmentByID,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
}
