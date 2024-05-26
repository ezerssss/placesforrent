import {
    doc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';

const params = new URL(document.location.toString()).searchParams;
const id = params.get('id');
const placeDocRef = doc(db, 'places', id ?? '-');

const stars = document.getElementById('stars');
const name = document.getElementById('name');
const description = document.getElementById('description');
const number = document.getElementById('contact-number');
const price = document.getElementById('price');
const images = document.getElementById('images');
const contact = document.getElementById('contact-name');
const landmark = document.getElementById('landmark');
const amenities = document.getElementById('amenities');
const moreInfo = document.getElementById('more-info');

window.addEventListener('load', async () => {
    const doc = await getDoc(placeDocRef);

    if (!doc.exists()) {
        history.back();

        return;
    }

    const place = doc.data();

    stars.innerHTML = '';

    for (let i = 0; i < Math.floor(place.rating); i++) {
        stars.innerHTML += '<i class="fa-solid fa-2x fa-star"></i>';
    }

    for (let i = 0; i < 5 - Math.floor(place.rating); i++) {
        stars.innerHTML += '<i class="fa-regular fa-2x fa-star"></i>';
    }

    name.innerText = place.name;
    description.innerText = place.description;
    number.innerText = place.contactNumber;
    price.innerText = `Php ${place.price}`;

    for (const image of place.images) {
        const sliderElement = document.createElement('div');
        sliderElement.className = 'swiper-slide';

        const imageElement = document.createElement('img');
        imageElement.alt = image;
        imageElement.src = image;
        imageElement.onclick = () => {
            imageElement.requestFullscreen();
        };

        sliderElement.appendChild(imageElement);

        images.appendChild(sliderElement);
    }

    new Swiper('.swiper', {
        loop: true,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    contact.innerText = `Contact: ${place.contact}`;
    landmark.innerText = `Landmark: ${place.landmark}`;

    amenities.innerHTML = '';
    for (const amenity of place.amenities) {
        amenities.innerHTML += `<div><img alt='internet' src='/img/amenities/${amenity}.png' />${amenity}</div>`;
    }

    moreInfo.innerText = place.moreInfo;
});
