const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
        index: true
    },
    version: String,
    description: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index composé pour assurer l'unicité de la combinaison vendor/name
productSchema.index({ vendor: 1, name: 1 }, { unique: true });

// Relation virtuelle avec les CVEs
productSchema.virtual('cves', {
    ref: 'CVE',
    localField: '_id',
    foreignField: 'products'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;