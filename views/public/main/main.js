const entryButton = document.getElementById('entry-button');
const entryModal = document.getElementById('entry-modal');
const backdrop = document.getElementById('modal-background');

entryButton.addEventListener('click', (event) => {
    entryModal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
});

backdrop.addEventListener('click', (event) =>{
    entryModal.classList.add('hidden');
    backdrop.classList.add('hidden');
});

const entryCreate = document.getElementById('create-button');

entryCreate.addEventListener('click', (event) =>{
    let id = window.location.pathname;
    id = id.slice(8);
    
    const entryObj = {
        _id : id,
    }
    
    const postData = JSON.stringify(entryObj);
    const postURL = `/people/${id}/new`;
    const request = new XMLHttpRequest();
    request.open('POST', postURL);

    request.addEventListener('load', (event) => {
        window.location = `/people/${id}`;
    });

    request.send(postData);
    entryModal.classList.add('hidden');
    backdrop.classList.add('hidden');
});