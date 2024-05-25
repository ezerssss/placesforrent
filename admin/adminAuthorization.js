import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import {
    collection,
    getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import auth from '../firebase/auth.js';
import db from '../firebase/db.js';

const adminCollectionRef = collection(db, 'admins');

const mainElement = document.querySelector('main');

onAuthStateChanged(auth, async (user) => {
    let isAuthorized = true;

    const adminEmails = [];

    const adminDocs = await getDocs(adminCollectionRef);
    adminDocs.forEach((doc) => {
        const data = doc.data();

        adminEmails.push(data.email);
    });

    if (user) {
        if (!adminEmails.includes(user.email)) {
            isAuthorized = false;
        }
    } else {
        isAuthorized = false;
    }

    if (!isAuthorized) {
        window.location.href = '/admin/login.html';

        return;
    }

    mainElement.style.visibility = 'visible';
});
