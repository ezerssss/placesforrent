import {
    collection,
    onSnapshot,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';
import { uploadImages } from '../utils/upload.js';

const placesCollectionRef = collection(db, 'places');

const placesContainer = document.getElementById('places');

const form = document.getElementById('new-place');
const formTitle = document.getElementById('form-title');

const submitButton = document.getElementById('submit');
const cancelButton = document.getElementById('cancel');

function reset() {
    form.reset();
    $('#multi-select').multipleSelect('uncheckAll');
    pond.removeFiles();
    formTitle.innerText = 'Add a new place';
    submitButton.value = 'Add new place';
    cancelButton.style.display = 'none';
}

async function handleUpdate(id) {
    if (formTitle.innerText !== 'Edit a place') {
        return;
    }

    const name = form.name.value;
    const description = form.description.value;
    const address = form.address.value;
    const type = form.type.value;
    const price = form.price.value;
    const amenities = $('#multi-select')
        .multipleSelect('getData')
        .filter((option) => option.selected)
        .map((option) => option.value);
    const landmark = form.landmark.value;
    const contact = form.contact.value;
    const contactNumber = form['contact-number'].value;
    const moreInfo = form['more-info'].value;
    const rating = form.rating.value;

    try {
        const images = await uploadImages(
            pond.getFiles().map((pondFile) => pondFile.file),
        );

        const docRef = doc(db, 'places', id);

        await updateDoc(docRef, {
            name,
            description,
            address,
            type,
            price: parseInt(price),
            amenities,
            landmark,
            contact,
            contactNumber,
            moreInfo,
            rating: parseInt(rating),
            images,
        });

        reset();
        alert('Successfully updated place.');
    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.value = 'Add new place';
    }
}

cancelButton.addEventListener('click', reset);

async function handleEdit(id) {
    const docRef = doc(db, 'places', id);

    const placeDoc = await getDoc(docRef);

    if (!placeDoc.exists) {
        alert('Place does not exist');

        return;
    }

    formTitle.innerText = 'Edit a place';
    submitButton.value = 'Edit place';
    cancelButton.style.display = 'inline';
    submitButton.addEventListener('click', () => handleUpdate(id));

    formTitle.scrollIntoView();

    const place = placeDoc.data();

    form.name.value = place.name;
    form.description.value = place.description;
    form.address.value = place.address;
    form.type.value = place.type;
    form.price.value = place.price;
    form.landmark.value = place.landmark;
    form.contact.value = place.contact;
    form['contact-number'].value = place.contactNumber;
    form['more-info'].value = place.moreInfo;
    form.rating.value = place.rating;

    const imagePromises = place.images.map((image) => fetch(image));
    const imageRes = await Promise.all(imagePromises);
    const blobPromises = imageRes.map((res) => res.blob());

    const blobs = await Promise.all(blobPromises);
    pond.addFiles(blobs);

    for (const amenity of place.amenities) {
        $('#multi-select').multipleSelect('check', amenity);
    }
}

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
        places.push(doc.data());
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

        editButton.addEventListener('click', () => handleEdit(place.id));

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

window.addEventListener('onunload', async () => {
    unsubscribe();
});
