<template>
  <div class="container">
    <div class="card-header">
      <h5>Liste des Thématiques</h5>
    </div>
    <hr />
    <form>
      <h6>Nouvelle Thématique</h6>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">Libellé</span>
        </div>
        <input type="text" class="form-control" v-model="libelle" required />
        <button
          class="btn btn-light"
          type="button"
          @click="createThem()"
          title="Création"
        >
          <i class="fa fa-save fa-lg"></i>
        </button>
      </div>
    </form>

    <div class="card-body table-responsive">
      <table class="table text-light">
        <thead>
          <tr>
            <th scope="col">
              <div class="float-left">Liste des Thématiques actuelles</div>
              <span class="float-right">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Filtrage</span>
                  </div>
                  <input type="text" class="form-control" v-model="filter" />
                  <button class="btn btn-light" type="button" title="Filtrage">
                    <i class="fa fa-search fa-lg"></i>
                  </button>
                </div>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <form v-for="them in filterByName" :key="them.id">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Libelle</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="them.libelle"
                    required
                  />
                  <button
                    class="btn btn-light"
                    type="button"
                    @click="updateThem(them)"
                    title="Modification"
                  >
                    <i class="fa fa-save fa-lg"></i>
                  </button>
                  <button
                    class="btn btn-light"
                    type="button"
                    @click="deleteThem(them)"
                    title="Suppression"
                  >
                    <i class="fa fa-trash fa-lg"></i>
                  </button>
                </div>
              </form>
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
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

export default {
  name: "ListeView",
  data() {
    return {
      listeThem: [], // Liste des thematique - collection thematique Firebase
      libelle: null, // Pour la création d'une nouvelle thematique
      filter: "",
    };
  },
  computed: {
    // Tri des thematique par libelle en ordre croissant
    orderByName: function () {
      // Parcours et tri des thematique 2 à 2
      return this.listeThem.sort(function (a, b) {
        // Si le libelle de la thematique est avant on retourne -1
        if (a.libelle < b.libelle) return -1;
        // Si le nom de la thematique est après on retourne 1
        if (a.libelle > b.libelle) return 1;
        // Sinon ni avant ni après (homonyme) on retourne 0
        return 0;
      });
    },
    // Filtrage de la propriété calculée de tri
    filterByName: function () {
      // On effectue le fitrage seulement si le filtre est renseigné
      if (this.filter.length > 0) {
        // On récupère le filtre saisi en minuscule (on évite les majuscules)
        let filter = this.filter.toLowerCase();
        // Filtrage de la propriété calculée de tri
        return this.orderByName.filter(function (them) {
          // On ne renvoie que les thematique dont le libelle contient
          // la chaine de caractère du filtre
          return them.libelle.toLowerCase().includes(filter);
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
    // Appel de la liste des thematique synchronisée
    this.getThem();
  },
  methods: {
    async getThem() {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document thematique
      const dbThem = collection(firestore, "thematique");
      // Liste des pays synchronisée
      const query = await onSnapshot(dbThem, (snapshot) => {
        console.log("query", query);
        //  Récupération des résultats dans listeThem
        // On utilse map pour récupérer l'intégralité des données renvoyées
        // on identifie clairement le id du document
        // les rest parameters permet de préciser la récupération de toute la partie data
        this.listeThem = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("listethem", this.listeThem);
      });
    },

    async createThem() {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document thematique
      const dbThem = collection(firestore, "thematique");
      // On passe en paramètre format json
      // Les champs à mettre à jour
      // Sauf le id qui est créé automatiquement
      const docRef = await addDoc(dbThem, {
        libelle: this.libelle,
      });
      console.log("document créé avec le id : ", docRef.id);
    },

    async updateThem(them) {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document thematique
      // Reference de la thematique à modifier
      const docRef = doc(firestore, "thematique", them.id);
      // On passe en paramètre format json
      // Les champs à mettre à jour
      await updateDoc(docRef, {
        libelle: them.libelle,
      });
    },

    async deleteThem(them) {
      // Obtenir Firestore
      const firestore = getFirestore();
      // Base de données (collection)  document thematique
      // Reference de la thematique à supprimer
      const docRef = doc(firestore, "thematique", them.id);
      // Suppression thematique référencé
      await deleteDoc(docRef);
    },
  },
};
</script>

<style scoped>
</style>


