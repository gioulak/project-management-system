const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    leader: {
        type: Number,
        required: true
    },
    members: [{
        type: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

teamSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});
module.exports = mongoose.model('Team', teamSchema);