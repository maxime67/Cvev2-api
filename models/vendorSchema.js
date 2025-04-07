const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: String,
    website: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Relation virtuelle avec les produits
vendorSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'vendor'
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;