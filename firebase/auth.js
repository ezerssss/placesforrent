import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import app from './index.js';

const auth = getAuth(app);

export default auth;
