const express    = require('express');
const router     = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    remove
} = require('../controllers/departmentController');

router.get('/',     getAll);   // GET    /api/departments
router.get('/:id',  getOne);   // GET    /api/departments/1
router.post('/',    create);   // POST   /api/departments
router.put('/:id',  update);   // PUT    /api/departments/1
router.delete('/:id', remove); // DELETE /api/departments/1

module.exports = router;