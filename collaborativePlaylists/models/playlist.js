const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    description: {type: String, required:true},
    collaborators: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    tracks: [{name: String, artist: String, albumCover: String, preview: String, bigCover: String}],
    pin: {type: String, required: true, unique: true}
})

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;