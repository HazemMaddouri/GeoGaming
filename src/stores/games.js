import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useGamesStore = defineStore('games', {
  id: 'test',
  state: () => ({
    formData: {
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    },
    markers: [],
    startPoint: null,
    userPosition: {},
    userMarker: null,
    match: {},
    matches: [],
    players: [],
  }),

  getters: {
    oneMatch: (state) => {
      return state.match;
    },

    allMatches: (state) => {
      return state.matches;
    },
  },
  actions: {
    async getMatches() {
      try {
        const response = await fetch(`https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/match/?per_page=100`);
        const data = await response.json();

        console.log(data);

        // Set the matches in the store
        this.matches = data;
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    },

    async getMatch(matchId) {

      const allMatches = this.allMatches;
    
      // Find the match in the already fetched matches
      const match = allMatches.find((m) => Number(m.id) === Number(matchId));

    
      if (match) {
        // If the match is found in the stored matches, set it in the store
        this.match = match;
        console.log("success")
      } else {
        // If the match is not found, you can still make an API request if needed
        try {
          console.log('donnée non disponible dans le store ');
          const response = await fetch(`https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/match/${matchId}`);
          const data = await response.json();
    
          console.log(data);
    
          // Set the match in the store
          this.match = data;
        } catch (error) {
          console.error('Error fetching match:', error);
        }
      }
    },
    


    async joinGame(matchId, userId, position) {
      try {
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NlcGVncmEtZnJvbnRlbmQueHl6L3dmMTEtYXRlbGllciIsImlhdCI6MTcwNzk5MDE5NSwibmJmIjoxNzA3OTkwMTk1LCJleHAiOjE3MDg1OTQ5OTUsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.fgYfqHYmhNdFnW0xOoL2pY1HBsBCgThfi-6sy2ti-FQ";
    
        const matchData = {
          fields: {

            players: [
              {
                userId: String(userId),
                position: {
                  latitude: position.latitude || "",
                  longitude: position.longitude || "",
                },
                marker: []  // Laissez le tableau de marqueurs vide pour le moment
              },
            ],
          },
        };
    
        const response = await fetch(`https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/match/${matchId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(matchData),
        });
    
        if (response.ok) {
          console.log(this.oneMatch.acf.players)
          console.log('Game joined successfully.');
    
          // Après avoir rejoint le jeu avec succès, récupérer les marqueurs du acf

          const oneMatch =this.oneMatch;
    
          // Extraire les informations des marqueurs du champ acf
          const markers = [];
          oneMatch.acf.markers.forEach((marker, index) => {
            markers.push({
              id: index, // Utilisez l'index comme identifiant
              name: marker.name,
              check: false // Vous pouvez initialiser check à false ici
            });
          });
    
          // Mettre les informations des marqueurs dans le joueur qui vient de rejoindre
          matchData.fields.players[0].marker = markers;
    
          // Utilisez la variable "matchData" selon vos besoins
          console.log(matchData);
    
          // Ajouter toute logique supplémentaire après avoir rejoint le jeu avec succès
        } else {
          console.error('Error joining game:', response.status);
          // Ajouter une logique de gestion des erreurs si nécessaire
        }
      } catch (error) {
        console.error('Error joining game:', error);
        // Ajouter une logique de gestion des erreurs si nécessaire
      }
    },
    


  



  


 
    postMatchData() {
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NlcGVncmEtZnJvbnRlbmQueHl6L3dmMTEtYXRlbGllciIsImlhdCI6MTcwNzk5MDE5NSwibmJmIjoxNzA3OTkwMTk1LCJleHAiOjE3MDg1OTQ5OTUsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.fgYfqHYmhNdFnW0xOoL2pY1HBsBCgThfi-6sy2ti-FQ";
    
      const matchData = {
        status: "publish",
        title: this.formData.title,
        fields: {
          title: this.formData.title,
          description: this.formData.description,
          start_date: this.formData.startDate,
          end_date: this.formData.endDate,
          markers: this.markers.map((marker) => ({
            name: marker.name,
            position: { ...marker.position },
            penality: "20",
          })),
          start_point: this.startPoint
            ? {
                name: this.startPoint.name,
                position: { ...this.startPoint.position },
                startGame: false,
                endGame: false,
              }
            : null,
          masteruid: '2', // Modifié en brut
          players: [
            {
              userId: '5',
              time: '10',
              markers: [
                {
                  marker_id: '1',
                  isCaptured: false
                },
                {
                  marker_id: '3',
                  isCaptured: false
                },
              ],
            },
            {
              userId: '3',
              time: '10',
              markers: [
                {
                  marker_id: '1',
                  isCaptured: false
                },
                {
                  marker_id: '3',
                  isCaptured: false
                },
              ],
            },
          ],
        },
      };
    
      fetch('https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(matchData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Réponse de l\'API :', data);
          // Ajoutez ici toute logique de gestion de la réponse de l'API
        })
        .catch(error => {
          console.error('Erreur lors de la requête POST :', error);
          // Ajoutez ici toute logique de gestion des erreurs
        });
    },
    
    updateMarkers(markers) {
      this.markers = reactive(
        markers.map((marker) => ({
          name: marker.name,
          marker: marker.marker,
          position: { ...marker.position },
          isCaptured: false
        }))
      )
    },

    updateStartPoint(startPoint) {
      this.startPoint = startPoint
    },

    async deleteGame(matchId) {
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NlcGVncmEtZnJvbnRlbmQueHl6L3dmMTEtYXRlbGllciIsImlhdCI6MTcwNzk5MDE5NSwibmJmIjoxNzA3OTkwMTk1LCJleHAiOjE3MDg1OTQ5OTUsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.fgYfqHYmhNdFnW0xOoL2pY1HBsBCgThfi-6sy2ti-FQ";
      try {
        const response = await fetch(`https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/match/${matchId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Replace with your actual authorization token
          },
        });

        if (response.ok) {
          console.log('Game deleted successfully.');
          // Add any additional logic after successfully deleting the game
        } else {
          console.error('Error deleting game:', response.status);
          // Add error handling logic if needed
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        // Add error handling logic if needed
      }
    },

    deleteMarker(marker) {
      this.markers = this.markers.filter((m) => m.name !== marker.name)
      // Mettez à jour le store après la suppression du marqueur
      this.updateMarkers(this.markers)
      console.log('supprimer du store')
    },

    deleteStartPoint() {
      this.startPoint = null
      console.log('supprimer du store')
      this.updateStartPoint(null)
    },

    updateUserPosition(position) {
      // Mettre à jour la position du joueur dans le store
      this.userPosition = position
      // Sauvegarder la position du joueur dans le localStorage
      this.saveDataToLocalStorage()
    },

    updateUserMarker(marker) {
      // Mettre à jour la référence du marqueur de l'utilisateur dans le store
      this.userMarker = marker
      this.saveDataToLocalStorage()
    }
  }
})

