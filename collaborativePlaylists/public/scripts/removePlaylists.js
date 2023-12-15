document.addEventListener('DOMContentLoaded', () => {
    var items = document.querySelectorAll('.playlistItem');

    items.forEach(item => {
        let button = item.querySelector('button');
        let itemId = item.id;

        button.addEventListener('click', () => {
            item.remove();
            fetch(`/playlists/remove/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
        })
    })
})