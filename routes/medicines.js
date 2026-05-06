const express = require('express');
const router  = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/medicineController');

router.get('/',       getAll);   // GET    /api/medicines
router.get('/:id',    getOne);   // GET    /api/medicines/1
router.post('/',      create);   // POST   /api/medicines
router.put('/:id',    update);   // PUT    /api/medicines/1
router.delete('/:id', remove);   // DELETE /api/medicines/1

module.exports = router;