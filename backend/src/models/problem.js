const mongoose = require('mongoose')
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },

    // ✅ Fix 1: type:[String] aur typo 'arrray' → 'array'
    tags: {
        type: [String],
        enum: ['array', 'linkedlist', 'graph', 'dp', 'tree', 'math', 'sorting'],
        required: true
    },

    visibleTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String }  // ✅ Fix 2: optional rakha
        }
    ],
    hiddenTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],
    startCode: [
        {
            language: { type: String, required: true },
            initialCode: { type: String, required: true }
        }
    ],
    referenceSolution: [
        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;