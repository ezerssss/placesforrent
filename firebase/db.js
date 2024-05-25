import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import app from './index.js';

const db = getFirestore(app);

export default db;
