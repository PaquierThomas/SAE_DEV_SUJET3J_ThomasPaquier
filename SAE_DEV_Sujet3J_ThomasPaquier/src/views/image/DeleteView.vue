<template>
  <div class="container">
    <form enctype="multipart/form-data" @submit.prevent="deleteImage">
      <div class="card bg-dark">
        <div class="card-header">
          <h5 style="color: white">Suppression d'une image</h5>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <div class="text-center">
                <img class="preview img-fluid" :src="photoActuelle" />
              </div>
            </div>

            <div class="col-6">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Libelle</span>
                </div>
                <input
                  class="form-control"
                  placeholder="Libelle de la personne"
                  v-model="image.libelle"
                  disabled
                />
              </div>
              <br />
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"> Description </span>
                </div>
                <input
                  class="form-control"
                  placeholder="Description de la personne"
                  v-model="image.description"
                  disabled
                />
              </div>
              <br />
            </div>
          </div>
          <br />
          <h5 class="alert alert-warning text-center" role="alert">
            Attention vous allez supprimer cette image, cette action est
            irréversible !!
          </h5>
        </div>

        <div class="card-footer">
          <button type="submit" class="float-left btn btn-dark">
            Supprimer
          </button>
          <button class="float-right btn btn-dark">
            <RouterLink to="/image">Cancel</RouterLink>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// Bibliothèque Firestore : import des fonctions
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

// Storage
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  uploadString,
  deleteObject,
  listAll,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

export default {
  name: "DeleteView",
  data() {
    return {
      image: {
        // Le image à créer
        libelle: null, // son libelle
        description: null, // sa description
        photo: null, // sa photo (libelle du fichier)
        thematique: null, // sa thématique
      },

      refImage: null, // Référence du image à modifier
      photoActuelle: null, // Photo actuelle du image
    };
  },
  mounted() {
    // Montage de la vue
    // Récupération du id passé en paramètre
    // On utilise le id passé par la route
    // via la variable système $route de la vue
    console.log("id image", this.$route.params.id);
    // Recherche image concerné
    this.getImage(this.$route.params.id);
  },

  methods: {
    async getImage(id) {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document image
      // Récupération sur Firestore du image via son id
      const docRef = doc(firestore, "image", id);
      // Référence du image concerné
      this.refImage = await getDoc(docRef);
      // Test si le image demandé existe
      if (this.refImage.exists()) {
        // Si oui on récupère ses données
        this.image = this.refImage.data();
        // Mémorisation photoActuelle
        this.photoActuelle = this.image.photo;
      } else {
        // Sinon simple message d'erreur
        this.console.log("image inexistant");
      }
      // Obtenir le Storage
      const storage = getStorage();
      // Référence de l'image du image
      const spaceRef = ref(storage, "image/" + this.image.photo);
      // Récupération de l'url complète de l'image
      getDownloadURL(spaceRef)
        .then((url) => {
          // Mise à jour de l'image prévisualisée
          this.photoActuelle = url;
        })
        .catch((error) => {
          console.log("erreur downloadUrl", error);
        });
    },

    async deleteImage() {
      const firestore = getFirestore();
      // Suppresion du image
      await deleteDoc(doc(firestore, "image", this.$route.params.id));

      // Suppresson de l'image
      const storage = getStorage();
      // Référence du fichier de la photo
      let docRef = ref(storage, "image/" + this.image.photo);
      // Suppression du fichier
      deleteObject(docRef);

      // redirection sur la liste des images
      this.$router.push("/images");
    },
  },
};
</script>

<style scoped>
a {
  color: white;
}
a:hover {
  text-decoration: none;
}
</style>


