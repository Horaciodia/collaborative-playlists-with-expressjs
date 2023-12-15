const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Playlist = require('../models/playlist');
const User = require('../models/user');

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login');
  }
}

router.use('/playlists', isAuthenticated);

async function getAccessToken(authorizationCode) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const auth = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authorizationCode);
    body.append('redirect_uri', redirect_uri);

    const config = {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    const response = await axios.post(tokenUrl, body.toString(), config);
    const tokenData = await response.data;
    
    return tokenData.access_token;
}

const client_id = '1380b20062c1497ca58a2877d52e5200';
const client_secret = '2bea6f5942bd40dd8f8ddca10c2b7ecc';
const redirect_uri = 'http://127.0.0.1:5000/playlists/';

let accessToken;
let currentUser;

router.use(express.static('public'));

router.get('/', async (req, res) => {
    res.locals.title = 'My Playlists';

    try {
      currentUser = req.user._id;
    } catch (err) {
      res.redirect('/login');
    }

    if (req.query.code) {
      let authorizationCode = req.query.code;
      accessToken = await getAccessToken(authorizationCode);
    }

    const playlists = await Playlist.find({
      $or: [
        { createdBy: currentUser },
        { collaborators: { $in: [currentUser] } }
      ]
    })
    
    res.render('playlists', {
      playlists: playlists
    });
})

router.get('/new', (req, res) => {
    res.locals.title = 'New Playlist';
    res.render('newPlaylist');
})

router.get('/search', async (req, res) => {
  let query = req.query.q;

  if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
  }

  const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      },
  })

  res.json(response.data);
});

router.get('/add', async (req, res) => {
  let trackId = req.query.track;
  let playlistId = req.query.playlist;

  if (!req.query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const response = await axios.get(`https://api.spotify.com/v1/search?type=track&q=isrc:${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  })

  let trackFound = response.data.tracks.items[0];
  let track = {
    name: trackFound.name,
    artist: trackFound.artists[0].name,
    albumCover: trackFound.album.images[2].url,
    preview: trackFound.preview_url,
    bigCover: trackFound.album.images[0].url
  };

  const playlist = await Playlist.findById(playlistId);
  playlist.tracks.addToSet(track);
  const updatedPlaylist = await playlist.save();
})

console

router.delete('/delete', async (req, res) => {
  const playlist = await Playlist.findById(req.query.playlistId);
  playlist.tracks = playlist.tracks.filter(track => track._id.toString() !== req.query.track);
  await playlist.save();
})

router.post('/new', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;

  const newPlaylist = new Playlist({
    name: title,
    createdBy: currentUser, 
    description: description,
    collaborators: [],
    tracks: [],
    pin: String(Math.floor(10000 + Math.random() * 99999))
  });

  newPlaylist.save()
    .then(savedPlaylist => {
        res.redirect(`/playlists/${savedPlaylist._id}`)
    })
})

async function getCollaborators(playlistCollabs) {
  let result = '';

  let users = [];
  for (let user of playlistCollabs) {
    users.push(await User.findById(user));
  }

  for (let i = 0; i < users.length; i++) {
    if (i == 0) {
      result += users[i].username;
    } else if (i != 0 && i != users.length - 1) {
      result += `${users[i].username}, `;
    } else if (i == users.length - 1) {
      result += `and ${users[i].username}`;
    }
  }

  return result;
};

router.get('/:playlistId', async (req, res) => {
  let id = req.params.playlistId;

  try {
    const playlist = await Playlist.findById(id);
    res.locals.title = playlist.name;

    if (!playlist) {
        return res.status(404);
    }

    const adminUser = await User.findById(playlist.createdBy);
    let collabs = await getCollaborators(playlist.collaborators);

    if (currentUser.toString() == playlist.createdBy.toString() || playlist.collaborators.some(collab => collab.toString() == currentUser.toString())) {
      let user = await User.findById(currentUser);
      res.render('playlistView', {
        playlist: playlist, 
        user: user,
        allowed: true,
        admin: currentUser.toString() == playlist.createdBy.toString(),
        creator: adminUser,
        collaborators: collabs
      });
    } else {
      let user = await User.findById(currentUser);
      res.render('playlistView', {
        playlist: playlist, 
        user: user,
        allowed: false,
        admin: false,
        creator: adminUser,
        collaborators: collabs
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/join/:playlistId', async (req, res) => {
  let id = req.params.playlistId;
  let pin = req.body.pin;

  const playlist = await Playlist.findById(id);

  if (!playlist) {
    return res.status(404);
  }

  if (pin == playlist.pin) {
    playlist.collaborators.push(currentUser);
    playlist.save();

    res.redirect(`/playlists/${id}`);
  }
});

router.delete(`/remove/:id`, async (req, res) => {
  let playlist = await Playlist.findOneAndDelete({_id: req.params.id})
})

module.exports = router;