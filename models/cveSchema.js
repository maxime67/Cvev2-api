const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const cvssMetricSchema = new Schema({
    cvssData: String,
    baseSeverity: String,
    baseScore: Number,
    vectorString: String,
    exploitabilityScore: Number,
    impactScore: Number
}, { _id: false });

const cveSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sourceIdentifier: String,
    published: Date,
    lastModified: Date,
    summary: String,
    descriptions: [{
        lang: String,
        value: String
    }],
    metrics: {
        cvssMetricV2: [cvssMetricSchema],
        cvssMetricV3: [cvssMetricSchema],
        cvssMetricV31: [cvssMetricSchema],
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        index: true
    }],
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        index: true
    },
    references: [{
        url: String,
        source: String,
        tags: [String]
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const CVE = mongoose.model('Cve', cveSchema);

module.exports = CVE;