import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import auth from '../firebase/auth.js';

const provider = new GoogleAuthProvider();

const navbarLinks = document.querySelector('nav .links');

onAuthStateChanged(auth, (user) => {
    const newTag = document.createElement('a');
    newTag.style.cursor = 'pointer';

    if (user) {
        newTag.innerText = 'Logout';

        newTag.addEventListener('click', () => {
            auth.signOut();
            newTag.remove();
        });

        navbarLinks.appendChild(newTag);
    } else {
        newTag.innerText = 'Login';

        newTag.addEventListener('click', () => {
            signInWithPopup(auth, provider).catch((error) => {
                const errorMessage = error.message;
                console.error(errorMessage);
            });

            newTag.remove();
        });

        navbarLinks.appendChild(newTag);
    }
});
