const express = require("express")
const verifyToken = require("../middlewares/authMiddlewares")
const authorizeRoles = require("../middlewares/authRoles")
const {addBatch,getBatchByMedicine,getExpiringBatches,updateBatch,deleteBatch} = require('../controllers/batchController')
router = express.Router()

// Add new batch (admin only)
router.post('/', verifyToken, authorizeRoles("admin"), addBatch)

// Get all batches for a specific medicine (admin & pharmacist)
router.get('/:medicineId', verifyToken, authorizeRoles("pharmacist", "admin"), getBatchByMedicine)

// Get batches expiring soon (?days=7)(admin and pharmacist)
router.get('/', verifyToken, authorizeRoles("pharmacist", "admin"), getExpiringBatches)

// Update a batch (admin only)
router.patch('/:batchId', verifyToken, authorizeRoles('admin'), updateBatch);

// delete a batch (admin only)
router.delete('/:batchId', verifyToken, authorizeRoles('admin'), deleteBatch);

module.exports = router 
