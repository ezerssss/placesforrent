import {
    collection,
    getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from './firebase/db.js';

const placesCollectionRef = collection(db, 'places');

window.addEventListener('load', async () => {
    const places = [];

    const snapshot = await getDocs(placesCollectionRef);

    snapshot.forEach((doc) => {
        places.push(doc.data());
    });

    console.log(places);
});
