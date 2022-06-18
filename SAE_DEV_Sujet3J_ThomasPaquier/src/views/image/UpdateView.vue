<template>
  <div class="container">
    <form enctype="multipart/form-data" @submit.prevent="updateImage">
      <div class="card bg-dark">
        <div class="card-header">
          <h5 style="color: white">Mise à jour de l'image</h5>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <div class="text-center">
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
                  placeholder="Libelle de la personne"
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
                  class="form-control"
                  placeholder="Description de l'image'"
                  v-model="image.description"
                  required
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
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button type="submit" class="float-left btn btn-dark">
            Modifier
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
  name: "UpdateView",
  data() {
    return {
      imageData: null, // Image prévisualisée
      image: {
        // L'image à créer
        libelle: null, // son libelle
        description: null, // sa description
        photo: null, // sa photo (libelle du fichier)
        thematique: null, // sa thématique
      },

      refImage: null, // Référence de l'image à modifier
      imgModifiee: false, // Indique si l'image de l'image a été modifiée, par défaut : non
      photoActuelle: null, // Photo actuelle de l'image
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
    // Appel de la liste des pays
    this.getPays();
  },

  methods: {
    async getPays() {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document pays
      const dbPays = collection(firestore, "pays");
      // Liste des images triés
      const q = query(dbPays, orderBy("libelle", "asc"));
      await onSnapshot(q, (snapshot) => {
        this.listePays = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    async getImage(id) {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document image
      // Récupération sur Firestore de l'image via son id
      const docRef = doc(firestore, "image", id);
      // Référence de l'image concerné
      this.refImage = await getDoc(docRef);
      // Test si l'image demandé existe
      if (this.refImage.exists()) {
        // Si oui on récupère ses données
        this.image = this.refImage.data();
        // Mémorisation photoActuelle
        this.photoActuelle = this.image.photo;
      } else {
        // Sinon simple message d'erreur
        this.console.log("Image inexistante");
      }
      // Obtenir le Storage
      const storage = getStorage();
      // Référence de l'image de l'image
      const spaceRef = ref(storage, "image/" + this.image.photo);
      // Récupération de l'url complète de l'image
      getDownloadURL(spaceRef)
        .then((url) => {
          // Mise à jour de l'image prévisualisée
          this.imageData = url;
        })
        .catch((error) => {
          console.log("erreur downloadUrl", error);
        });
    },

    previewImage: function (event) {
      // Mise à jour de la photo de l'image
      this.file = this.$refs.file.files[0];
      // Récupérer le libelle du fichier pour la photo de l'image
      this.image.photo = this.file.name;
      // Si cette fonction s'exécute, c'est que l'image est modifiée
      this.imgModifiee = true;
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

    async updateImage() {
      // Si l'image a été modifiée
      if (this.imgModifiee) {
        // On supprime l'ancienne
        const storage = getStorage();
        // Référence du fichier
        let docRef = ref(storage, "image/" + this.photoActuelle);
        // Suppression photo actuelle
        deleteObject(docRef);
        // création nouvelle photo
        // Référence de l'image à uploader
        docRef = ref(storage, "image/" + this.image.photo);
        await uploadString(docRef, this.imageData, "data_url").then(
          (snapshot) => {
            console.log("Uploaded a base64 string", this.image.photo);
          }
        );
      }
      // Dans tous les cas on met à jour l'image dans Firestore
      const firestore = getFirestore();
      // Modification de l'image à partir de son id
      await updateDoc(
        doc(firestore, "image", this.$route.params.id),
        this.image
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


