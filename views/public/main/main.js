const entryButton = document.getElementById('entry-button');
const entryModal = document.getElementById('entry-modal');
const backdrop = document.getElementById('entry-modal-backdrop');

entryButton.addEventListener('click', (event) => {
    entryModal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    window.scrollTo(0, 0);
});

backdrop.addEventListener('click', (event) =>{
    entryModal.classList.add('hidden');
    backdrop.classList.add('hidden');
});

const entryCreate = document.getElementById('create-button');

entryCreate.addEventListener('click', (event) =>{
    let id = window.location.pathname;
    id = id.slice(8);

    const weightVar = document.getElementById('weight-input');

    const entryObj = {
        weight: weightVar.value,
        time: new Date()
    };
    
    const postData = JSON.stringify(entryObj);
    const postURL = `/people/${id}/new`;
    const request = new XMLHttpRequest();
    request.open('POST', postURL);
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', (event) => {
        window.location = `/people/${id}`;
    });

    request.send(postData);
    entryModal.classList.add('hidden');
    backdrop.classList.add('hidden');
});
