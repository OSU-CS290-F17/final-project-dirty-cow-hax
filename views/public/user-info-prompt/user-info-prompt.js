const background = document.getElementById('modal-background');
const modal = document.getElementById('user-info-prompt');

background.addEventListener('click', () => {

    modal.classList.add('hidden');

});





const name = document.getElementById('name-input');
const age  = document.getElementById('age-input');

const createButton = document.getElementById('create-button');

createButton.addEventListener('click', () => {

    // console.log(name.value);
    // console.log(age.value);

    const userObject = {
        name: name.value,
        age: age.value
    };

    const postData = JSON.stringify(userObject);

    const postURL = `/people/new`;
    const request = new XMLHttpRequest();
    request.open('POST', postURL);
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', (event) => {
        window.location = `/people/${event.target.response}`;
    });

    request.send(postData);

    modal.classList.add('hidden');

});
