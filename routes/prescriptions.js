const express = require('express');
const router = express.Router();
const { getAll,getByAppointment, create, remove } = require('../controllers/prescriptionController');

router.get('/', getAll);                                     // GET /api/prescriptions
router.get('/appointment/:appointmentId', getByAppointment); // GET /api/prescriptions/appointment/1
router.post('/', create);                                    // POST /api/prescriptions
router.delete('/:id', remove);                               // DELETE /api/prescriptions/1


module.exports = router;