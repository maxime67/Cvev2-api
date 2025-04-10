const mongoose = require('mongoose');

const UserCVEInteractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cves',
        required: true
    },
    status: {
        type: String,
        enum: ['Follow', 'Mitigated', 'Patch'],
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index pour accélérer les recherches
UserCVEInteractionSchema.index({ userId: 1, cveId: 1 }, { unique: true });

module.exports = mongoose.model('UserCVEInteraction', UserCVEInteractionSchema);