import { createRouter, createWebHistory } from 'vue-router'

// Fonction d'authentification
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

// Fonctions Firestore
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'


import AccueilView from '../views/AccueilView.vue'
import DecouvrirView from '../views/DecouvrirView.vue'
import ChatView from '../views/ChatView.vue'

import MonCompte from '../views/MonCompte.vue'



import ListeImage from '../views/image/ListeView.vue'
import CreateImage from '../views/image/CreateView.vue'
import UpdateImage from '../views/image/UpdateView.vue'
import DeleteImage from '../views/image/DeleteView.vue'

import ListeThematique from '../views/thematique/ListeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/accueil', name: 'AccueilView', component: AccueilView },
    { path: '/decouvrir', name: 'DecouvrirView', component: DecouvrirView },

    { path: '/monCompte', name: 'MonCompte', component: MonCompte },

    { path: '/chat', name: 'ChatView', component: ChatView },

    { path: '/image', name: 'ListeImage', component: ListeImage },
    { path: '/createImage', name: 'CreateImage', component: CreateImage, beforeEnter: guard },
    { path: '/updateImage/:id', name: 'UpdateImage', component: UpdateImage, beforeEnter: guard },
    { path: '/deleteImage/:id', name: 'DeleteImage', component: DeleteImage, beforeEnter: guard },

    { path: '/thematique', name: 'ListeThematique', component: ListeThematique, beforeEnter: guard },


  ]
})

// On créé un guard : Observateur (fonction) permettant de savoir si un utilisateur
// a le droit d'utiliser une route
// paramètres : to : d'où il vient, from où il veut aller, next où il doit aller après contrôle
function guard(to, from, next) {
  // recherche utilisateur connecté
  getAuth().onAuthStateChanged(function (user) {
    if (user) {
      // User connecté
      console.log('router OK => user ', user);
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document participant
      const dbUsers = collection(firestore, "users");
      // Recherche du user par son uid
      const q = query(dbUsers, where("uid", "==", user.uid));
      onSnapshot(q, (snapshot) => {
        let userInfo = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // userInfo étant un tableau, on récupère
        // ses informations dans la 1° cellule du tableau : 0
        let isAdmin = userInfo[0].admin;
        if (isAdmin) {
          // Utilisateur administrateur, on autorise la page/vue
          next(to.params.name);
          return;
        } else {
          // Utilisateur non administrateur, renvoi sur accueil
          alert("Vous n'avez pas l'autorisation pour cette fonction");
          next({ name: "AccueilView" });
          return;
        }
      })
    } else {
      // Utilisateur non connecté, renvoi sur accueil
      console.log('router NOK => user ', user);
      next({ name: "AccueilView" });
    }
  });
}

export default router


