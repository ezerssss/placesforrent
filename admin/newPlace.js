import {
    collection,
    addDoc,
    updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';
import { uploadImages } from '../utils/upload.js';

const placesCollectionRef = collection(db, 'places');

const form = document.getElementById('new-place');
const formTitle = document.getElementById('form-title');

const submitButton = document.getElementById('submit');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (formTitle.innerText !== 'Add a new place') {
        return;
    }

    submitButton.disabled = true;
    submitButton.value = 'Loading...';

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

        form.reset();
        $('#multi-select').multipleSelect('uncheckAll');
        pond.removeFiles();
        alert('Successfully uploaded place.');
    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.value = 'Add new place';
    }
});
