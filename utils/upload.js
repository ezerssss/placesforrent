import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js';
import storage from '../firebase/storage.js';

export async function uploadImages(files) {
    const uploadedFileUrls = [];
    const uploadPromises = [];

    for (const file of files) {
        // File is already uploaded
        if (
            typeof file === 'string' &&
            file.includes('https://firebasestorage.googleapis.com/')
        ) {
            uploadedFileUrls.push(file);
            continue;
        }

        const imageRef = ref(storage, `images/${file.name}-${uuidv4()}`);

        uploadPromises.push(uploadBytes(imageRef, file));
    }

    const snapshots = await Promise.all(uploadPromises);

    const urlPromises = [];

    for (const snapshot of snapshots) {
        urlPromises.push(getDownloadURL(snapshot.ref));
    }

    const newUrls = await Promise.all(urlPromises);

    return [...uploadedFileUrls, ...newUrls];
}
