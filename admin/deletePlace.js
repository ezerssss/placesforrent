import {
    collection,
    onSnapshot,
    doc,
    deleteDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';

const placesCollectionRef = collection(db, 'places');

const placesContainer = document.getElementById('places');

async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this place?")
    if (confirmDelete) {
        try {
            const docRef = doc(db, 'places', id);
            await deleteDoc(docRef);
            alert('Successfully deleted place.');
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    } else {
        return;
    }
}

const unsubscribe = onSnapshot(placesCollectionRef, (snapshot) => {
    const places = [];

    snapshot.docs.forEach((doc) => {
        places.push({id: doc.id, ...doc.data()});
    });

    placesContainer.innerHTML = `
        <header>
            <p>ID</p>
            <p>Name</p>
            <p>Actions</p>
        </header>`;

    for (const place of places) {
        const wrapper = document.createElement('div');
        const id = document.createElement('p');
        id.innerText = place.id;

        const name = document.createElement('p');
        name.innerText = place.name;

        const actionWrapper = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.className = 'edit karla-bold';

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete karla-bold';

        deleteButton.addEventListener('click', () => handleDelete(place.id));

        actionWrapper.appendChild(editButton);
        actionWrapper.appendChild(deleteButton);

        wrapper.appendChild(id);
        wrapper.appendChild(name);
        wrapper.appendChild(actionWrapper);

        placesContainer.appendChild(wrapper);
    }
});

window.addEventListener('unload', async () => {
    unsubscribe();
});
