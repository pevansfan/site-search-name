// Nouvelle instance
new Vue({
    el: '#app',
    data: {
        fnameQuery: '', // Prénom saisie par l'utilisateur
        age: null, // Age
        count: null, // Nombre total de personnes portant le nom de la variable fnameQuery
        error: null // Erreurs
    },
    computed: {
        transformFnameQuery() {
            return this.fnameQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); // Permet de retirer les accents et mettre en minuscules (voir le lien suivant : https://www.equinode.com/fonctions-javascript/retirer-les-accents-avec-javascript)
        }
    },
    methods: {
        async getAgifyInfos() {
            if (!this.fnameQuery) { // Le cas où l'utilisateur ne saisit aucun caractères
                this.age = null;
                this.count = null;
                return this.error = 'Veuillez saisir un nom ou prénom'; // Affichage de l'erreur
            }

            try { // Le cas où il y a aucune erreur
                const response = await axios.get(`https://api.agify.io?name=${this.transformFnameQuery}&country_id=FR`); // J'utilise Axios pour interroger l'API Agify avec le prénom normalisé de l'utilisateur.
                this.age = response.data.age; // Affichage de l'âge du prénom à partir des données de la variable response
                this.count = response.data.count; // Affichage du nombre total des gens portant le même prénom à partir des données de la variable response
                this.error = null; 
            } catch (error) { // Le cas où il y a une ou plusieurs erreurs
                console.error('Une erreur s\'est produite lors de la récupération des informations Agify :', error); // Cette erreur peut se produire lorsqu'il y a un problème de récupération des données de l'API Agify ou la limitation des requêtes effectuées (maximum 100 par jour) par exemple.
                this.age = null;
                this.count = null;
                this.error = 'Une erreur s\'est produite lors de la récupération des informations Agify';
            }
        },

        onEnter(event) { // Permet d'exécuter une fonction lorsque l'utilisateur appuie sur la touche "Entrée"
            var input = document.getElementById("myInput");
            input.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    document.getElementById("btn").click();
                }
            });
        }
    },
    mounted() {
        window.addEventListener('keypress', this.onEnter); // Chargement de la page lorsque le bouton "Entrée" est pressée
    },
    beforeDestroy() {
        window.removeEventListener('keypress', this.onEnter); // On retire ce chargement après l'affichage des infos
    }
});

// Sources pour l'utilisation des API Agify et les mots-clés async et await :
// https://agify.io
// https://rapidapi.com/guides/axios-async-await
// https://stackabuse.com/handling-errors-with-axios/
