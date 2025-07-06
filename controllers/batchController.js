const createError = require("http-errors")
const Medicine = require('../models/medicines')
const Batch = require("../models/batch")
const mongoose = require('mongoose')

const addBatch = async (req, res, next) => {
    try {
        const { medicine, batchNumber, expiryDate, quantity, createdBy } = req.body

        //validating required fields
        if (!medicine || !batchNumber || !expiryDate || !quantity || !createdBy) {
            throw createError.BadRequest("Some fields are missing")
        }

        //validating quantity
        if (quantity <= 0) {
            throw createError.NotAcceptable("quantity cannot be negative")
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
            createdBy: req.user._id //got from jwt

        })
        console.log(req.user?._id)
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
    res.send("this is getBatchByMedicine Route")
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