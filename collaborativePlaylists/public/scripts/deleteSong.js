function deleteTrack(playlistId, trackId) {

    fetch(`/playlists/delete?track=${encodeURIComponent(trackId)}&playlistId=${encodeURIComponent(playlistId)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => console.log(response));
}

let firstSongWidth = window.getComputedStyle(document.querySelector('li')).width;
if (window.innerWidth > 800) {
    document.querySelectorAll('li').forEach(item => {
        item.style.width = firstSongWidth;
    })

    let divs = [document.querySelector('.introduction'), document.querySelector('.addTracks')];
    divs.forEach(div => {
        div.style.width = window.getComputedStyle(document.querySelector('.trackList')).width
    })
}
