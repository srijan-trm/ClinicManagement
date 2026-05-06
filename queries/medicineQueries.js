const pool = require('../db');

const getAllMedicines = async () => {
    const result = await pool.query(
        'SELECT * FROM medicines ORDER BY name'
    );
    return result.rows;
};

const getMedicineById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM medicines WHERE medicine_id = $1',[id]
    );
    return result.rows;
};

const addMedicine = async (name, category, unit, price, stock) => {
    const result = await pool.query(
        `INSERT INTO medicines (name, category, unit, price, stock) 
        VALUES($1,$2,$3,$4,$5)
        RETURNING *`,
        [name, category, unit, price, stock]
    );
};

const updateMedicine = async (id, name, category, unit, price, stock) => {
    const result = await pool.query(
        `UPDATE medicines 
        SET name = $1, category = $2, unit = $3, price = $4, stock = $5) 
        WHERE medicine_id = $6
        RETURNING *`,
        [name, category, unit, price, stock,id]
    );
};

const deleteMedicine = async (id) => {
    const result = await pool.query(
        'DELETE FROM medicines WHERE medicine_id = $1 RETURNING *', [id]
    );
    return result.rows[0];
};

const searchMedicine = async (name) => {
    const result = await pool.query(
        'SELECT * FROM medicines WHERE NAME ILIKE $1 ORDER BY NAME',[`%${name}%`]
    );
    return result.rows;
};

module.exports = {
    getAllMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicine
}
