const express = require('express');

const router = express.Router();

const {
    getPatientHealth,
    savePatientHealth
} = require('../controllers/healthController');

router.get('/:id', getPatientHealth);

router.put('/:id', savePatientHealth);

module.exports = router;