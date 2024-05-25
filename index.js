import {
    collection,
    getDocs,
    query,
    where,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from './firebase/db.js';

const placesCollectionRef = collection(db, 'places');

const placesContainer = document.getElementById('places');

window.addEventListener('load', async () => {
    const places = [];

    const q = query(placesCollectionRef, where('type', '==', 'dorm'));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
        places.push(doc.data());
    });

    console.log(places);

    placesContainer.innerHTML = '';

    places.forEach((place) => {
        placesContainer.innerHTML += `
            <a href='/property/?id=${place.id}'>
                <article class='property'>
                    <img alt='${place.images[0]} src='{${place.images[0]}}'/>

                    <div class='property-info'>
                        <div>
                            <h2 class='league-spartan-bold'>${place.name}</h2>
                            <p class='karla'>
                                <i class="fa-solid fa-lg fa-location-pin"></i>
                                ${place.address}
                            </p>
                        </div>
                    </div>
                </article>
            </a>
        `;
    });
});
