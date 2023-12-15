const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    collaboratesIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
});

userSchema.methods.isCollab = function(playlistId) {
    return this.collaboratesIn.includes(playlistId);
}

const User = mongoose.model('User', userSchema);

module.exports = User;