const updateEntryButton = document.getElementById('success');
const deleteButton = document.getElementById('delete');
const updateModal = document.getElementById('update-modal');

updateEntryButton.addEventListener('click', (event) =>{
    console.log("update entry button clicked");
    updateModal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
});

deleteButton.addEventListener('click', (event) =>{

});

backdrop.addEventListener('click', (event) =>{
    updateModal.classList.add('hidden');
    backdrop.classList.add('hidden');
});

