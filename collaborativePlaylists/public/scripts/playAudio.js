let player = document.querySelector('#audioPlayer');
let songsOnPlaylist = document.querySelectorAll('.song');
let playerImage = document.querySelector('#playerImage');
let songName = document.querySelector('.musicPlayer .songName');
let artistName = document.querySelector('.musicPlayer .artistName');
let nothingPlaying = document.querySelector('.nothingPlaying');
let notPlayingP = document.querySelector('.notPlaying');

nothingPlaying.style.height = window.getComputedStyle(nothingPlaying).width;

for (let li of songsOnPlaylist) {
    const audioFile = li.getAttribute('data-trackAudio');
    li.querySelector('img').onclick = () => {
        nothingPlaying.style.display = 'none';
        notPlayingP.style.display = 'none';

        if (li.getAttribute('data-trackAudio') == '') {
            notPlayingP.style.display = 'flex';
            artistName.style.display = 'none';
            songName.style.display = 'none';
            notPlayingP.innerHTML = "There isn't an audio for this song";
        } else {
            artistName.style.display = 'block';
            songName.style.display = 'block';
        }

        if (window.innerWidth <= 800) {
            document.querySelector('.currentlyPlaying').setAttribute('src', li.querySelector('img').src);    
        } else {
            document.querySelector('.currentlyPlaying').setAttribute('src', li.getAttribute('data-bigCover'));    
        }
        songName.innerHTML = li.querySelector('.songName').innerHTML;
        artistName.innerHTML = li.querySelector('.artistName').innerHTML;
        if (!player.paused && player.currentSrc.includes(audioFile)) {
            player.pause();
            playerImage.src = '/images/play.png';
        } else if (player.paused || !player.currentSrc.includes(audioFile)) {
            player.src = audioFile;
            player.play();
            playerImage.src = '/images/pause.png';
        }

    }
}

let button = document.querySelector('.pause');
button.onclick = () => {
    if (!player.paused) {
        playerImage.src = '/images/play.png';
        player.pause();      
    } else if (player.paused) {
        player.play();
        playerImage.src = '/images/pause.png';
    }
}

let displayButton = document.querySelector('.displaySongs');
displayButton.onclick = () => {
    if (document.querySelector('.trackList ul').style.display === 'none') {
        document.querySelector('.trackList ul').style.display = 'flex';
        displayButton.querySelector('img').src = 'images/up.png';
    } else {
        document.querySelector('.trackList ul').style.display = 'none';
        document.querySelector('.trackList').style.width = `${parseInt(window.getComputedStyle(document.querySelector('li')).width) + 40}px`;
        displayButton.querySelector('img').src = 'images/down.png';
    }
}
