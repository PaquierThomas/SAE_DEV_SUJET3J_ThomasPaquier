import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import de mitt
import mitt from 'mitt';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIalEBMfXRLbWraFKe5uMfZEKCvlLeSGo",
    authDomain: "sae-developpement-tpaquier.firebaseapp.com",
    projectId: "sae-developpement-tpaquier",
    storageBucket: "sae-developpement-tpaquier.appspot.com",
    messagingSenderId: "143675008825",
    appId: "1:143675008825:web:89fc193d2d7f86458d2ae8"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


const app = createApp(App)

// Création d'un emetteur mitt exportable
export const emitter = mitt();
// créer l'émetteur comme propriété globale
// de l'application
app.config.globalProperties.emitter = emitter;

app.use(router)

app.mount('#app')
