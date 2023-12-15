var input = document.getElementById('trackSearcher');
var songs = document.querySelector('#songs');

var playlistId = window.location.pathname.split('/')[2]

function spotifySearch() {
    let search = input.value;
    songs.innerHTML = '';

    if (search !== '') {
        fetch(`/playlists/search?q=${encodeURIComponent(search)}`)
        .then(response => response.json())
        .then(data => {
            data.tracks.items.forEach(item => {
                if (songs.querySelectorAll('li').length < 5) {
                    let albumCoverURL = item.album.images[item.album.images.length - 1].url;
                    console.log(item.album.images[0].url);
                    let cover = document.createElement('img');
                    cover.src = albumCoverURL;
                    cover.classList.add('cover');
                    cover.style.maxHeight = '64px';

                    let divContainer = document.createElement('div');
                    divContainer.style.display = 'flex';
                    divContainer.style.flexDirection = 'column';

                    let addButton = document.createElement('button');
                    addButton.innerHTML = 'Add';
                    addButton.onclick = () => {
                        fetch(`/playlists/add?track=${encodeURIComponent(item.external_ids.isrc)}&playlist=${encodeURIComponent(playlistId)}`);
                    }
                    
                    let container = document.createElement('li');

                    let songName = document.createElement('p');
                    songName.classList.add('songName');
                    songName.innerHTML = item.name;

                    let artistName = document.createElement('p');
                    artistName.classList.add('artistName');
                    artistName.innerHTML = item.artists[0].name;

                    container.append(cover)
                    divContainer.appendChild(songName);
                    divContainer.append(artistName);
                    container.append(divContainer);
                    container.append(addButton);

                    songs.appendChild(container);
                }
            })
        })
    }
}