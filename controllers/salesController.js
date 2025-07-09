const createError = require("http-errors");
const Medicine = require("../models/medicines");
const Batch = require("../models/batch");

const validateSale = async (req, res, next) => {
    try {
        const { qrCode, quantity } = req.body;

        // Validate input
        if (!qrCode) {
            return next(createError.NotFound("Qr code not found"));
        }
        if (!quantity || quantity <= 0) {
            return next(createError.BadRequest("Quantity must be a positive number"));
        }

        // Find medicine by qrCode
        const med = await Medicine.findOne({ qrCode: qrCode });
        if (!med) {
            return next(createError.NotFound("Medicine not found"));
        }

        // Find batches with available quantity, sorted by expiry date ascending
        const batches = await Batch.find({
            medicine: med._id,
            quantity: { $gt: 0 },
            expiryDate: { $gte: new Date() }
        }).sort({ expiryDate: 1 });

        if (!batches.length) {
            return res.status(400).json({
                message: "No available batches for this medicine."
            });
        }

        let remainingQty = quantity;
        const deductions = []; // Track deductions per batch

        for (const batch of batches) {
            if (batch.quantity >= remainingQty) {
                // Batch can cover the remaining quantity
                batch.quantity -= remainingQty;
                deductions.push({ batchNumber: batch.batchNumber, deductedQty: remainingQty });
                remainingQty = 0;
                await batch.save();
                break;
            } else {
                // Use up this batch entirely and continue to next
                deductions.push({ batchNumber: batch.batchNumber, deductedQty: batch.quantity });
                remainingQty -= batch.quantity;
                batch.quantity = 0;
                await batch.save();
            }
        }

        if (remainingQty > 0) {
            // Not enough quantity in all batches combined
            return res.status(400).json({
                message: `Insufficient quantity. ${remainingQty} more units needed.`
            });
        }

        // Build detailed deduction message
        const deductionDetails = deductions
            .map(d => `${d.deductedQty} units from batch ${d.batchNumber}`)
            .join(', ');

        // Success response
        return res.status(200).json({
            message: `Successfully deducted ${quantity} units of medicine ${med.name} (${deductionDetails}).`
        });

    } catch (err) {
        next(err);
    }
};

module.exports = validateSale;
