import {
    GoogleAuthProvider,
    signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import {
    collection,
    getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import auth from '../firebase/auth.js';
import db from '../firebase/db.js';

const adminCollectionRef = collection(db, 'admins');

const provider = new GoogleAuthProvider();

const loginButton = document.getElementById('login-button');
const errorTag = document.getElementById('error-msg');

loginButton.addEventListener('click', async () => {
    errorTag.innerText = '';

    const adminEmails = [];

    const adminDocs = await getDocs(adminCollectionRef);
    adminDocs.forEach((doc) => {
        const data = doc.data();

        adminEmails.push(data.email);
    });

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            const email = user.email;

            if (!adminEmails.includes(email)) {
                auth.signOut();
                errorTag.innerText = 'Error: Not an admin.';

                return;
            }

            window.location.href = '/admin/';
        })
        .catch((error) => {
            const errorMessage = error.message;
            errorTag.innerText = errorMessage;
        });
});
