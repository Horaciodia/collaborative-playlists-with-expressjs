document.addEventListener('DOMContentLoaded', () => {
    let h1Width = window.getComputedStyle(document.querySelector('h1')).width;
    let liElements = document.querySelectorAll('li');

    liElements.forEach(item => {
        let paddingDouble = parseFloat(window.getComputedStyle(item).padding) * 2;

        item.style.width = `${(parseFloat(h1Width) - paddingDouble)}px`;
    });

    let createNewButton = document.querySelector('.newPlaylist');
    createNewButton.style.width = h1Width;
})