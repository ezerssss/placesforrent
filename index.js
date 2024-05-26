import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from './firebase/db.js';

const queryParams = new URLSearchParams(window.location.search);
const typeFilter = queryParams.get('type')
    ? queryParams.get('type').split(',')
    : [];
const orderFilter = queryParams.get('order') ?? 'price-asc';
const searchQuery = queryParams.get('search') ?? '';
const searchRegex = new RegExp(searchQuery, 'im');

const placesCollectionRef = collection(db, 'places');

const placesContainer = document.getElementById('places');

window.addEventListener('load', async () => {
    const places = [];

    let q = query(placesCollectionRef);

    if (typeFilter.length > 0) {
        q = query(q, where('type', 'in', typeFilter));
    }

    if (orderFilter === 'price-asc') {
        q = query(q, orderBy('price', 'asc'));
    } else if (orderFilter === 'price-desc') {
        q = query(q, orderBy('price', 'desc'));
    }

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
        places.push(doc.data());
    });

    let hasResults = false;

    placesContainer.innerHTML = '';

    places
        .filter((place) => {
            if (!searchQuery) {
                return true;
            }

            return (
                !!place.name.match(searchRegex) ||
                !!place.address.match(searchRegex) ||
                !!place.contact.match(searchRegex) ||
                !!place.description.match(searchRegex) ||
                !!place.amenities.join(',').match(searchRegex) ||
                !!place.landmark.match(searchRegex) ||
                !!place.moreInfo.match(searchRegex) ||
                place.price === parseInt(searchQuery)
            );
        })
        .forEach((place) => {
            if (!hasResults) {
                hasResults = true;
            }

            let amenities = '';

            for (const amenity of place.amenities) {
                amenities += `
                <div class='tooltip'>
                    <span class='karla tooltip-text'>${amenity}</span>
                    <img alt='internet' src='/img/amenities/${amenity}.png' />
                </div>
            `;
            }

            placesContainer.innerHTML += `
            <a href='/property/?id=${place.id}'>
                <article class='property'>
                    <img alt='${place.images[0]}' src='${place.images[0]}'/>

                    <div class='property-info'>
                        <div>
                            <h2 class='league-spartan-bold'>${place.name}</h2>
                            <p class='karla'>
                                <i class="fa-solid fa-lg fa-location-pin"></i>
                                ${place.address}
                            </p>
                            <p class="league-spartan-bold">₱${place.price}/month</p>
                        </div>
                        <div class="amenities">
                            ${amenities}
                        </div>
                    </div>
                </article>
            </a>
        `;
        });

    if (!hasResults) {
        placesContainer.innerHTML = "<h3 class='karla-bold'>No results</h3>";
    }
});
