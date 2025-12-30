const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    teamId: {
        type: String,
        required: true,
        index: true
    },
    createdBy: {
        type: Number,
        required: true
    },
    assignedTo: {
        type: Number,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO',
        index: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    dueDate: {
        type: Date,
        required: true
    },
    comments: [commentSchema],
    attachments: [{
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        uploadedBy: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
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

taskSchema.pre('save', async function() {
    this.updatedAt = Date.now();
    //next();
});

taskSchema.index({ teamId: 1, status:1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);