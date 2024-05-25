import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js';
import storage from '../firebase/storage.js';

export async function uploadImages(files) {
    const uploadPromises = [];

    for (const file of files) {
        const imageRef = ref(storage, `images/${file.name}-${uuidv4()}`);

        uploadPromises.push(uploadBytes(imageRef, file));
    }

    const snapshots = await Promise.all(uploadPromises);

    const urlPromises = [];

    for (const snapshot of snapshots) {
        urlPromises.push(getDownloadURL(snapshot.ref));
    }

    return await Promise.all(urlPromises);
}
