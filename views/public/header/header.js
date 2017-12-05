const newUserButton = document.getElementById('new-user-button');
const signInButton  = document.getElementById('sign-in-button');

const signInModal   = document.getElementById('user-info-prompt');

newUserButton.addEventListener('click', (event) => {

    signInModal.classList.remove('hidden');

});
