const express = require('express');
const router  = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/doctorController');

router.get('/',       getAll);   // GET    /api/doctors
router.get('/:id',    getOne);   // GET    /api/doctors/1
router.post('/',      create);   // POST   /api/doctors
router.put('/:id',    update);   // PUT    /api/doctors/1
router.delete('/:id', remove);   // DELETE /api/doctors/1

module.exports = router;