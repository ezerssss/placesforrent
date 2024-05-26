import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import auth from '../firebase/auth.js';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    increment,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import db from '../firebase/db.js';

const params = new URL(document.location.toString()).searchParams;
const id = params.get('id');

let user;

const placeDocRef = doc(db, 'places', id ?? '-');
const commentsCollectionRef = collection(db, 'places', id ?? '-', 'comments');

const form = document.getElementById('comment');
const input = form.querySelector('input');
const rating = form.querySelector('select');
const submit = form.querySelector('button');
const toolTipText = document.getElementById('tooltip-text');

const comments = document.getElementById('comments');

onAuthStateChanged(auth, async (userSnapshot) => {
    user = userSnapshot;

    input.disabled = !user;
    rating.disabled = !user;
    submit.disabled = !user;

    if (user) {
        submit.style.cursor = 'pointer';
        submit.style.color = 'black';
    } else {
        toolTipText.innerText = 'You need to be logged-in to comment.';
        submit.style.cursor = 'default';
        submit.style.color = 'rgba(16, 16, 16, 0.3)';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!user || !form.comment.value) {
        return;
    }

    submit.disabled = true;

    await addDoc(commentsCollectionRef, {
        comment: form.comment.value,
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        rating: parseInt(form.rating.value),
    });

    const doc = await getDoc(placeDocRef);
    const place = doc.data();
    const ratingCount = place.ratingCount ?? 1;

    const newRating =
        (place.rating + parseInt(form.rating.value)) / (ratingCount + 1);

    const newRatingCount = place.ratingCount ? increment(1) : 2;

    await updateDoc(placeDocRef, {
        rating: newRating,
        ratingCount: newRatingCount,
    });

    form.comment.value = '';
    form.rating.value = 5;
    submit.disabled = false;
});

const unsubscribe = onSnapshot(commentsCollectionRef, (snapshot) => {
    comments.innerHTML = '';

    let hasRated = false;
    let isOwnComment = false;

    snapshot.docs.forEach((doc) => {
        const comment = doc.data();

        if (comment.uid === user.uid) {
            hasRated = true;
        }

        isOwnComment = comment.uid === user.uid;

        let starsDisplay = '';

        for (let i = 0; i < comment.rating; i++) {
            starsDisplay += '<i class="fa-solid fa-2x fa-star"></i>';
        }

        for (let i = 0; i < 5 - comment.rating; i++) {
            starsDisplay += '<i class="fa-regular fa-2x fa-star"></i>';
        }

        const commentWrapper = document.createElement('div');
        commentWrapper.className = 'comment';
        commentWrapper.innerHTML = `
        <div>
            <p class='karla-bold name'>${comment.name}</p>
            <p class='karla email'>${comment.email}</p>
            <div class='stars'>
                ${starsDisplay}
            </div>
            <p class='karla'>${comment.comment}</p>
        </div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML =
            '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButton.disabled = !isOwnComment;
        deleteButton.style.display = isOwnComment ? 'block' : 'none';

        if (isOwnComment) {
            deleteButton.addEventListener('click', async () => {
                const deleteConfirm = confirm('Confirm deletion?');

                if (deleteConfirm) {
                    await deleteDoc(doc.ref);

                    const placeDoc = await getDoc(placeDocRef);
                    const place = placeDoc.data();
                    const ratingCount = place.ratingCount;

                    const newRating =
                        (place.rating * ratingCount - comment.rating) /
                        (ratingCount - 1);

                    await updateDoc(placeDocRef, {
                        rating: newRating,
                        ratingCount: increment(-1),
                    });
                }
            });
        }

        commentWrapper.appendChild(deleteButton);
        comments.appendChild(commentWrapper);
    });

    const isDisabled = hasRated || !user;

    input.disabled = isDisabled;
    submit.disabled = isDisabled;
    rating.disabled = isDisabled;

    if (isDisabled) {
        if (hasRated) {
            toolTipText.innerText = 'You can only rate and comment once.';
        } else {
            toolTipText.innerText = 'You need to be logged-in to comment.';
        }

        submit.style.cursor = 'default';
        submit.style.color = 'rgba(16, 16, 16, 0.3)';
    } else {
        submit.style.cursor = 'pointer';
        submit.style.color = 'black';
    }
});

window.addEventListener('onunload', async () => {
    unsubscribe();
});
