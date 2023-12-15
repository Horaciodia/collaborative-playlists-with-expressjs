document.addEventListener('DOMContentLoaded', () => {
    function containerResize() {
        let h1Width = window.getComputedStyle(document.querySelector('h1')).width;
        let container = document.querySelector('p');
        container.style.width = `${parseFloat(h1Width) - (parseFloat(h1Width) * 0.3)}px`;
    }

    containerResize();

    window.addEventListener('resize', () => {
        containerResize();

        let firstButtonWidth = window.getComputedStyle(document.querySelector('.register-button')).width;
        let secondButton = document.querySelectorAll('.register-button')[1];
        secondButton.style.width = firstButtonWidth;
    })
})