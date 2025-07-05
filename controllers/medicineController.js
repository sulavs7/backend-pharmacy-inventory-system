const Medicine = require("../models/medicines")
const createError = require('http-errors')

const medicineEntry = async (req, res, next) => {
    try {
        const result = req.body
        if (!result.qrCode || !result.medicineName || !result.dosageForm) {
            throw createError.BadRequest("Some fields are missing");
        }
        const doesExist = await Medicine.findOne({ qrCode: result.qrCode })
        if (doesExist)
            throw createError.Conflict("Meds already in database")
        const newMedicine = new Medicine(result)
        const savedMedicine = await newMedicine.save()
        // Send response with 201 status
        res.status(201).json({
            success: true,
            data: savedMedicine,
            message: "Medicine added successfully"
        });
    }
    catch (err) {
        next(err)
    }

}
const getAllMedicine = async (req, res, next) => {
    try {
        const medicines = await Medicine.find() //fetches all the meds 
        res.status(200).json({
            success: true,
            data: medicines,
            message: "All medicines retrieved successfully",
        })

    }
    catch (error) {
        next(error)
    }

}
const getMedicineById = async (req, res, next) => {
    try {
        const medsId = req.params.id
        if (!medsId.match(/^[0-9a-fA-F]{24}$/)) {
            throw createError.BadRequest("Invalid medicine ID format");
        }
        const exist = await Medicine.findById(medsId)
        if (!exist) {
            throw createError.NotFound("Medicine not found");
        }
        res.status(200).json({
            success: true,
            data: exist,
            message: "Medicine retrieved successfully"
        })

    } catch (err) {
        next(err);
    }

}

const updateMedicine = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw createError.BadRequest("Invalid medicine ID")
        }
        const updates = req.body

        // Prevent updating immutable fields
        const allowedFields = ['MedicineName', 'genericName', 'qrCode', 'minThreshold', 'manufacturer', 'dosageForm'];
        const selfUpdates = {}
        allowedFields.forEach(field => {
            if (field in updates) {
                selfUpdates[field] = updates[field]
            }
        })
        // Check if selfUpdates is empty
        if (Object.keys(selfUpdates).length === 0) {
            throw createError.BadRequest("No valid fields provided for update");
        }

        const updatedMedicine = await Medicine.findByIdAndUpdate(id, selfUpdates, { new: true })
        if (!updatedMedicine)
            throw createError.NotFound("Medicine not found")

        res.status(200).json({
            success: true,
            data: updatedMedicine,
            message: "Medicine updated successfully"
        })
    } catch (err) {
        next(err)
    }
}

const deleteMedicine = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            throw createError.BadRequest("Invalid medicine Id")
        const deleteMedicine = await Medicine.findByIdAndDelete(id)
        if (!deleteMedicine) {
            throw createError.NotFound("Medicine not found");
        }
        res.status(200).json({
            success: true,
            data: deleteMedicine,
            message: "Medicine deleted successfully",
        });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    medicineEntry,
    getAllMedicine,
    getMedicineById,
    updateMedicine,
    deleteMedicine
}