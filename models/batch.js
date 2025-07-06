const mongoose = require("mongoose")

const batchSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId, //This tells Mongoose that the medicine field will store a MongoDB ObjectId.
        ref: "Medicine",
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
}
)

module.exports = mongoose.model("batch", batchSchema)
