const express = require('express');
const router  = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/patientController');

router.get('/',       getAll);   // GET    /api/patients
router.get('/:id',    getOne);   // GET    /api/patients/1
router.post('/',      create);   // POST   /api/patients
router.put('/:id',    update);   // PUT    /api/patients/1
router.delete('/:id', remove);   // DELETE /api/patients/1

module.exports = router;