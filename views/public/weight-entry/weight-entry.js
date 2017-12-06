// const thisIndex = document.getElementById("index");

// const updateEntryButton = document.getElementById('update-entry');
// const deleteButton = document.getElementById('delete-entry');
// const updateModal = document.getElementById('update-modal');

// updateEntryButton.addEventListener('click', (event) =>{
//     updateModal.classList.remove('hidden');
//     backdrop.classList.remove('hidden');
// });

// deleteButton.addEventListener('click', (event) =>{

// });

// backdrop.addEventListener('click', (event) =>{
//     updateModal.classList.add('hidden');
//     backdrop.classList.add('hidden');
// });


function openModal(index) {
    window.scrollTo(0, 0);
    document.getElementById('update-modal-container' + index).classList.remove('hidden');
}

 
function closeModal(index) {
    document.getElementById('update-modal-container' + index).classList.add('hidden');
}
    
function update(index, oldWeight, oldTime) {


    let userID = window.location.pathname;
    userID = userID.slice(8);

    let weight = document.getElementById('weight-input' + index).value;
    document.getElementById('update-modal-container' + index).classList.add('hidden');

    console.log(index, oldWeight, weight, oldTime, userID);

    const entryObj = {
        oldWeight: oldWeight,
        oldTime: oldTime,
        weight: weight,
        time: new Date()
    };

    const postData = JSON.stringify(entryObj);
    const postURL = `/people/${userID}`;
    const request = new XMLHttpRequest();
    request.open('PUT', postURL);
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', (event) => {
        window.location = `/people/${userID}`;
    });

    request.send(postData);
   
}

function deleteEntry(index, oldWeight, oldTime) {

    let userID = window.location.pathname;
    userID = userID.slice(8);

    const entryObj = {
        weight: oldWeight,
        time: oldTime
    };

    const postData = JSON.stringify(entryObj);
    const postURL = `/people/${userID}/delete`;
    const request = new XMLHttpRequest();
    request.open('DELETE', postURL);
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', (event) => {
        window.location = `/people/${userID}`;
    });

    request.send(postData);
}
