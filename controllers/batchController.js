const createError = require("http-errors")
const Medicine = require('../models/medicines')
const Batch = require("../models/batch")
const mongoose = require('mongoose')
const { $gte, $lte } = require("sift")

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
    try {
        //Converts the string value from the query parameter to an integer number. For example, "10" becomes 10. req.query.days is obtained from url 
        const days = parseInt(req.query.days) || 7;

        const todayDate = new Date();
        const futureDate = new Date();
        //getDate will only show the day ie getDate(2060-03-17) will output 17 . But futuredate.setDate(15) will set the date to 15th of the month 

        futureDate.setDate(todayDate.getDate() + days)

        //finding batch between the expiry period 
        const expiringBatches = await Batch.find({
            expiryDate: { $gte: todayDate, $lte: futureDate },//$gte means greater than or equal to today 
            quantity: { $gt: 0 } //only qty>0 is considered
        }).populate("medicine", "medicineName genericName")

        res.status(200).json({
            success: true,
            data: expiringBatches,
            message: `Batches expiring within ${days} day(s)`
        });

    }
    catch (err) {
        next(err)
    }
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