const createError = require("http-errors")
const Medicine = require('../models/medicines')
const Batch = require("../models/batch")
const mongoose = require('mongoose')

const addBatch = async (req, res, next) => {
    try {
        const { medicine, batchNumber, expiryDate, quantity } = req.body

        //validating required fields
        if (!medicine || !batchNumber || !expiryDate || !quantity) {
            throw createError.BadRequest("Some fields are missing")
        }

        //validating quantity
        if (quantity <= 0) {
            throw createError.NotAcceptable("quantity cannot be negative")

        }

        // Check if expiryDate is a valid date string
        if (isNaN(Date.parse(expiryDate))) {
            throw createError.BadRequest("Invalid expiry date");
        }

        // Check if expiryDate is not in the past
        if (new Date(expiryDate) < new Date()) {
            throw createError.BadRequest("Expiry date cannot be in the past");
        }

        //validating if objectId is proper 
        if (!mongoose.Types.ObjectId.isValid(medicine)) {
            throw createError.BadRequest("Invalid medicine ID")
        }

        //checking if medicine exists 
        const exists = await Medicine.findById(medicine)
        if (!exists) {
            throw createError.BadRequest("Medicine not found please enter the medicine first before adding batch")
        }

        //if medicine exists create new batch
        const newBatch = new Batch({
            medicine,
            batchNumber,
            expiryDate,
            quantity,
            createdBy: req.user.id //got from jwt

        })
        const savedBatch = await newBatch.save()

        res.status(201).json({
            success: true,
            data: savedBatch,
            message: "Batch added successfully"
        })


    } catch (err) {
        next(err)
    }

}
const getBatchByMedicine = async (req, res, next) => {
    try {
        const { medicineId } = req.params

        // Validate medicineId
        if (!mongoose.Types.ObjectId.isValid(medicineId)) {
            throw createError.BadRequest("Invalid medicine ID")
        }
        //find Batch wiht this medicineId
        const batches = await Batch.find({ medicine: medicineId })
            .populate('medicine', 'medicineName genericName dosageForm');

        res.status(200).json({
            success: true,
            count: batches.length,
            data: batches,
            message: "succesful to getBatchByMedicine"
        })
    }
    catch (err) {
        next(err)
    }

}
const getExpiringBatches = async (req, res, next) => {
    res.send("this is getExpiringBatches Route")
}
const updateBatch = async (req, res, next) => {
    res.send("this is updateBatch Route")
}
const deleteBatch = async (req, res, next) => {
    res.send("this is deleteBatch Route")
}

module.exports = {
    addBatch,
    getBatchByMedicine,
    getExpiringBatches,
    updateBatch,
    deleteBatch
}