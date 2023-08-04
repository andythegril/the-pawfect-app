const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    from_userId: String,
    to_userId: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;