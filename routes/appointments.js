const express = require('express');
const router = express.Router();
const { getAll, getOne, create, updateStatus, remove } = require('../controllers/appointmentController');

router.get('/', getAll);                // GET /api/appointments
router.get('/:id', getOne);             // GET /api/appointments/1
router.post('/', create);               // POST /api/appointments
router.patch('/:id/status', updateStatus); // PATCH /api/appointments/1/status
router.delete('/:id', remove);          // DELETE /api/appointments/1

module.exports = router;