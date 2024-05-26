import {
    collection,
    addDoc,
    updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';
import { uploadImages } from '../utils/upload.js';

const placesCollectionRef = collection(db, 'places');

const form = document.getElementById('new-place');
const multiSelectHeader = document.querySelector('.multi-select-header');
const submitButton = document.getElementById('new-place-submit');

function resetMultiSelect() {
    form.querySelectorAll('[name="amenities[]"]').forEach((input) =>
        input.remove(),
    );
    form.querySelectorAll('.multi-select-header-option').forEach((span) =>
        span.remove(),
    );

    const placeholder = document.createElement('span');
    placeholder.innerText = 'Select amenities';
    placeholder.className = 'multi-select-header-placeholder';
    multiSelectHeader.appendChild(placeholder);

    form.querySelectorAll('.multi-select-option').forEach(
        (option) => (option.className = 'multi-select-option'),
    );
    form.querySelectorAll('.multi-select-all').forEach(
        (option) => (option.className = 'multi-select-all'),
    );
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.value = 'Loading...';

    const name = form.name.value;
    const description = form.description.value;
    const address = form.address.value;
    const type = form.type.value;
    const price = form.price.value;

    const amenities = [];

    form.querySelectorAll('[name="amenities[]"]').forEach((input) =>
        amenities.push(input.value),
    );

    const landmark = form.landmark.value;
    const contact = form.contact.value;
    const contactNumber = form['contact-number'].value;
    const moreInfo = form['more-info'].value;
    const rating = form.rating.value;

    try {
        const images = await uploadImages(form.images.files);
        const docRef = await addDoc(placesCollectionRef, {
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

        await updateDoc(docRef, { id: docRef.id });

        resetMultiSelect();
        form.reset();
        alert('Successfully uploaded place.');
    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.value = 'Add new place';
    }
});
