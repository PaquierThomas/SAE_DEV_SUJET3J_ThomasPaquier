<template>
  <div class="card bg-dark">
    <div class="card-header">
      <h5 style="margin-bottom: 5px">
        Découvrir des images

        <span class="float-right">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Filtrage</span>
            </div>
            <input type="text" class="form-control" v-model="filter" />
            <button class="btn btn-light" type="button" title="Filtrage">
              <i class="fa fa-search fa-lg"></i>
            </button>
            <span
              style="margin-left: 10px; margin-top: 7px"
              title="Créer un nouveau image"
            >
              <router-link to="/createImage">
                <i class="fa fa-plus fa-lg text-light"></i>
              </router-link>
            </span>
          </div>
        </span>
      </h5>

      <table class="table text-light" style="margin-top: 33px">
        <thead>
          <tr>
            <th scope="col" class="text-center">Image</th>
            <th scope="col">Libelle</th>
            <th scope="col">Description</th>
            <th scope="col">Thématique</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="part in listeImage" :key="part.id">
            <td class="text-center">
              <img
                class="media-object imageSmall"
                :src="part.photo"
                :alt="part.description + ' ' + part.libelle"
              />
            </td>
            <td>
              <b>{{ part.libelle }}</b>
            </td>
            <td>{{ part.description }}</td>
            <td>{{ part.thematique }}</td>
            <td>
              <span title="Supprimer le image" class="mr-2">
                <RouterLink
                  :to="{ name: 'DeleteImage', params: { id: part.id } }"
                >
                  <i class="fa fa-times fa-lg text-light"></i>
                </RouterLink>
              </span>
              <span title="Modifier l'image" class="mr-2">
                <!-- Pour passer un paramètre dans la navigation :
                                On utilise le libelle de la route
                                l'attribut params, permet de préciser le libelle du paramètre (id) 
                                et sa valeur (part.id, id du image) 
                                -->
                <RouterLink
                  :to="{ name: 'UpdateImage', params: { id: part.id } }"
                >
                  <i class="fa fa-edit fa-lg text-light"></i>
                </RouterLink>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// Bibliothèque Firestore : import des fonctions
import {
  getFirestore, // Obtenir le Firestore
  collection, // Utiliser une collection de documents
  doc, // Obtenir un document par son id
  getDocs, // Obtenir la liste des documents d'une collection
  addDoc, // Ajouter un document à une collection
  updateDoc, // Mettre à jour un document dans une collection
  deleteDoc, // Supprimer un document d'une collection
  onSnapshot, // Demander une liste de documents d'une collection, en les synchronisant
  query, // Permet d'effectuer des requêtes sur Firestore
  orderBy, // Permet de demander le tri d'une requête query
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

// Cloud Storage : import des fonctions
import {
  getStorage, // Obtenir le Cloud Storage
  ref, // Pour créer une référence à un fichier à uploader
  getDownloadURL, // Permet de récupérer l'adress complète d'un fichier du Storage
  uploadString, // Permet d'uploader sur le Cloud Storage une image en Base64
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

export default {
  name: "ListeView",
  data() {
    return {
      listeImage: [], // Liste des images
      listeThem: [], // Liste des thematique - collection thematique Firebase
      filter: "",
    };
  },
  computed: {
    // Filtrage de la propriété calculée de tri
    filterByName: function () {
      // On effectue le fitrage seulement si le filtre est renseigné
      if (this.filter.length > 0) {
        // On récupère le filtre saisi en minuscule (on évite les majuscules)
        let filter = this.filter.toLowerCase();
        // Filtrage de la propriété calculée de tri
        return this.orderByName.filter(function (image) {
          // On ne renvoie que les image dont le libelle contient
          // la chaine de caractère du filtre
          return image.libelle.toLowerCase().includes(filter);
        });
      } else {
        // Si le filtre n'est pas saisi
        // On renvoie l'intégralité de la liste triée
        return this.orderByName;
      }
    },
  },
  mounted() {
    // Montage de la vue
    // Appel de la liste des images
    this.getImage();
  },
  methods: {
    async getImage() {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document image
      const dbPart = collection(firestore, "image");
      // Liste des images triés sur leur libelle
      const q = query(dbPart, orderBy("libelle", "asc"));
      await onSnapshot(q, (snapshot) => {
        this.listeImage = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Récupération des images de chaque image
        // parcours de la liste
        this.listeImage.forEach(function (personne) {
          // Obtenir le Cloud Storage
          const storage = getStorage();
          // Récupération de l'image par son libelle de fichier
          const spaceRef = ref(storage, "image/" + personne.photo);
          // Récupération de l'url complète de l'image
          getDownloadURL(spaceRef)
            .then((url) => {
              // On remplace le libelle du fichier
              // Par l'url complète de la photo
              personne.photo = url;
            })
            .catch((error) => {
              console.log("erreur downloadUrl", error);
            });
        });
      });
    },

    // Format date en français
    dateFr(d) {
      let date = d.split("-");
      return date[2] + "/" + date[1] + "/" + date[0];
    },
  },
};
</script>

<style scoped>
</style>


