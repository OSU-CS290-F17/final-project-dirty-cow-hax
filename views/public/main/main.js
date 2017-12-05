const entryButton = document.getElementById('entry-button');
const entryModal = document.getElementById('entry-modal');
const backdrop = document.getElementById('modal-background');

entryButton.addEventListener('click', (event) => {
    entryModal.classList.remove('hidden');
    backdrop.classLost.remove('hidden');
});