const express = require('express')
const verifyToken = require('../middlewares/authMiddlewares')
const authorizeRoles = require('../middlewares/authRoles')
const { medicineEntry, getAllMedicine, getMedicineById, updateMedicine, deleteMedicine } = require('../controllers/medicineController')

router = express.Router()

// /api/medicines/
router
    .route('/')
    .post(verifyToken, authorizeRoles("admin"), medicineEntry)
    .get(verifyToken, getAllMedicine)

// /api/medicines/:id
router
    .route('/:id')
    .get(verifyToken, getMedicineById)
    .patch(verifyToken, authorizeRoles("admin"), updateMedicine)
    .delete(verifyToken, authorizeRoles("admin"), deleteMedicine)


module.exports = router