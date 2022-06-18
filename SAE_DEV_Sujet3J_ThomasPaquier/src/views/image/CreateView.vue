<template>
  <div class="container">
    <form enctype="multipart/form-data" @submit.prevent="createImage">
      <div class="card bg-dark">
        <div class="card-header">
          <h5 style="color: white">Création images</h5>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <div>
                <img class="preview img-fluid" :src="imageData" />
              </div>
            </div>

            <div class="col-6">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Libelle</span>
                </div>
                <input
                  class="form-control"
                  placeholder="Libelle de l'image"
                  v-model="image.libelle"
                  required
                />
              </div>
              <br />
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Description</span>
                </div>
                <input
                  v-model="image.description"
                  class="form-control"
                  rows="5"
                  placeholder="Description de l'image"
                  key="required"
                />
              </div>
              <br />
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Photo</span>
                </div>
                <div class="custom-file">
                  <input
                    type="file"
                    class="custom-file-input"
                    ref="file"
                    id="file"
                    @change="previewImage"
                  />
                  <label class="custom-file-label" for="file"
                    >Sélectionner l'image</label
                  >
                </div>
              </div>
              <br />
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="margin-right: 34px">
                    Thématique</span
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input type="checkbox" class="form-check-input" />
                  <label class="form-check-label">Paysage</label>
                </div>
                <div class="form-check form-check-inline">
                  <input type="checkbox" class="form-check-input" />
                  <label class="form-check-label">Portrait</label>
                </div>
                <div class="form-check form-check-inline">
                  <input type="checkbox" class="form-check-input" />
                  <label class="form-check-label">Dessin</label>
                </div>
                <div class="form-check form-check-inline">
                  <input type="checkbox" class="form-check-input" />
                  <label class="form-check-label">Sculpture</label>
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button type="submit" class="float-left btn btn-dark">Créer</button>
          <button class="float-right btn btn-dark">
            <router-link to="/image">Cancel</router-link>
          </button>
        </div>
      </div>
    </form>
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
  name: "CreateView",
  data() {
    return {
      imageData: null, // Image prévisualisée
      image: {
        // L'image à créer
        libelle: null, // libelle de l'image
        description: null, // sa description
        photo: null, // sa photo (libelle du fichier)
        thematique: null, // sa thématique
      },
    };
  },
  mounted() {},
  methods: {
    previewImage: function (event) {
      // Mise à jour de la photo du image
      this.file = this.$refs.file.files[0];
      // Récupérer le libelle du fichier pour la photo de l'image
      this.image.photo = this.file.name;
      // Reference to the DOM input element
      // Reference du fichier à prévisualiser
      var input = event.target;
      // On s'assure que l'on a au moins un fichier à lire
      if (input.files && input.files[0]) {
        // Creation d'un filereader
        // Pour lire l'image et la convertir en base 64
        var reader = new FileReader();
        // fonction callback appellée lors que le fichier a été chargé
        reader.onload = (e) => {
          // Read image as base64 and set to imageData
          // lecture du fichier pour mettre à jour
          // la prévisualisation
          this.imageData = e.target.result;
        };
        // Demarrage du reader pour la transformer en data URL (format base 64)
        reader.readAsDataURL(input.files[0]);
      }
    },

    async createImage() {
      // Obtenir storage Firebase
      const storage = getStorage();
      // Référence de l'image à uploader
      const refStorage = ref(storage, "image/" + this.image.photo);
      // Upload de l'image sur le Cloud Storage
      await uploadString(refStorage, this.imageData, "data_url").then(
        (snapshot) => {
          console.log("Uploaded a base64 string");

          // Création de l'image sur le Firestore
          const db = getFirestore();
          const docRef = addDoc(collection(db, "image"), this.image);
        }
      );
      // redirection sur la liste des images
      this.$router.push("/image");
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


