import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: 'AIzaSyCtr6B_isvJrS5pqFaSq7uO5Bg6B-go7LA',
	authDomain: 'aeuen-deb1e.firebaseapp.com',
	projectId: 'aeuen-deb1e',
	storageBucket: 'aeuen-deb1e.appspot.com',
	appId: '1:249456415564:web:8f0186254d65b0d9d635e9'
};

// Initialize Firebase
if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}

// make auth and firestore references
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// update firestore settings
db.settings({ timestampsInSnapshots: true });
