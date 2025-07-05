const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true,
            trim: true,
        },
        genericName: {
            type: String,
            trim: true,
        },
        manufacturer: {
            type: String,
            required: true,
            trim: true,
        },
        dosageForm: {
            type: String,
            enum: ['tablet', 'syrup', 'injection'],
            required: true,
            trim: true,
        },
        qrCode: {
            type: String,
            unique: true,
            // required: true,
            trim: true,
        },
        minThreshold: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model('Medicine', medicineSchema);