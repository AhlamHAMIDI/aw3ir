// main.js - Application Météo VueJS

var app;
window.onload = function() {
    app = new Vue({
        el: '#weatherApp',
        data: {
            // Indicateur de chargement de l'application
            loaded: false,

            // Variable liée au formulaire de saisie
            formCityName: '',

            // Messages d'information
            message: '',
            messageForm: '',

            // Liste des villes (initialisée avec Paris)
            cityList: [
                { name: 'Paris' }
            ],

            // Données météo de la ville sélectionnée
            cityWeather: null,

            // Indicateur de chargement des données météo
            cityWeatherLoading: false,

            // Clé API OpenWeatherMap (remplacez par votre propre clé)
            apiKey: '9d9b8f54e284b89821fd4a4f5e904485'
        },

        // Méthode appelée au chargement de l'application
        mounted: function() {
            this.loaded = true;
            this.readData();
        },

        methods: {
            // Lecture des données au démarrage
            readData: function() {
                console.log('Liste des villes:', JSON.stringify(this.cityList));
                console.log('Application chargée:', this.loaded);
            },

            // Ajouter une ville à la liste
            addCity: function(event) {
                event.preventDefault(); // Empêche le rechargement de la page

                // Vérifie si la ville existe déjà
                if (this.isCityExist(this.formCityName)) {
                    this.messageForm = 'Cette ville existe déjà dans la liste !';
                } else {
                    // Ajoute la ville à la liste
                    this.cityList.push({ name: this.formCityName });
                    this.messageForm = '';
                    this.message = 'Ville ajoutée avec succès !';
                    
                    // Affiche la météo de la ville ajoutée
                    this.meteo({ name: this.formCityName });
                    
                    // Réinitialise le formulaire
                    this.formCityName = '';
                    
                    // Efface le message après 3 secondes
                    setTimeout(() => {
                        this.message = '';
                    }, 3000);
                }
            },

            // Vérifie si une ville existe déjà dans la liste
            isCityExist: function(cityName) {
                return this.cityList.filter(item => 
                    item.name.toUpperCase() === cityName.toUpperCase()
                ).length > 0;
            },

            // Supprime une ville de la liste
            remove: function(city) {
                this.cityList = this.cityList.filter(item => item.name !== city.name);
                
                // Si la ville supprimée était affichée, on cache les infos météo
                if (this.cityWeather && this.cityWeather.name === city.name) {
                    this.cityWeather = null;
                }
                
                this.message = 'Ville supprimée de la liste';
                setTimeout(() => {
                    this.message = '';
                }, 3000);
            },

            // Récupère les données météo d'une ville
            meteo: function(city) {
                this.cityWeatherLoading = true;
                this.message = '';

                // Appel à l'API OpenWeatherMap
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city.name + '&units=metric&lang=fr&appid=' + this.apiKey)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(json) {
                        app.cityWeatherLoading = false;

                        // Vérifie le code de réponse
                        if (json.cod === 200) {
                            app.cityWeather = json;
                            app.message = '';
                            console.log('Données météo:', json);
                        } else {
                            app.cityWeather = null;
                            app.message = 'Météo introuvable pour ' + city.name + ' (' + json.message + ')';
                        }
                    })
                    .catch(function(error) {
                        app.cityWeatherLoading = false;
                        app.message = 'Erreur lors de la récupération des données météo';
                        console.error('Erreur:', error);
                    });
            },

            // Récupère la position GPS de l'utilisateur (BONUS)
            getMyPosition: function() {
                if (navigator.geolocation) {
                    this.message = 'Récupération de votre position...';
                    
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            
                            this.cityWeatherLoading = true;
                            
                            // Appel API avec les coordonnées GPS
                            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&lang=fr&appid=' + this.apiKey)
                                .then(response => response.json())
                                .then(json => {
                                    this.cityWeatherLoading = false;
                                    
                                    if (json.cod === 200) {
                                        this.cityWeather = json;
                                        this.message = 'Position actuelle: ' + json.name;
                                        
                                        // Ajoute la ville à la liste si elle n'existe pas
                                        if (!this.isCityExist(json.name)) {
                                            this.cityList.push({ name: json.name });
                                        }
                                    }
                                })
                                .catch(error => {
                                    this.cityWeatherLoading = false;
                                    this.message = 'Erreur lors de la récupération de la météo';
                                    console.error(error);
                                });
                        },
                        (error) => {
                            this.message = 'Impossible de récupérer votre position. Vérifiez les autorisations.';
                            console.error('Erreur géolocalisation:', error);
                        }
                    );
                } else {
                    this.message = 'La géolocalisation n\'est pas supportée par votre navigateur';
                }
            }
        },

        // Propriétés calculées
        computed: {
            // Heure de la dernière mise à jour
            cityWheaterDate: function() {
                if (this.cityWeather !== null) {
                    var date = new Date(this.cityWeather.dt * 1000);
                    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    return date.getHours() + ':' + minutes;
                }
                return '';
            },

            // Heure du lever du soleil
            cityWheaterSunrise: function() {
                if (this.cityWeather !== null) {
                    var date = new Date(this.cityWeather.sys.sunrise * 1000);
                    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    return date.getHours() + ':' + minutes;
                }
                return '';
            },

            // Heure du coucher du soleil
            cityWheaterSunset: function() {
                if (this.cityWeather !== null) {
                    var date = new Date(this.cityWeather.sys.sunset * 1000);
                    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    return date.getHours() + ':' + minutes;
                }
                return '';
            },

            // Calcul de la zone d'affichage OpenStreetMap
            openStreetMapArea: function() {
                if (this.cityWeather !== null) {
                    const zoom = 8;
                    const delta = 0.05 / Math.pow(2, zoom - 10);

                    const bboxEdges = {
                        south: this.cityWeather.coord.lat - delta,
                        north: this.cityWeather.coord.lat + delta,
                        west: this.cityWeather.coord.lon - delta,
                        east: this.cityWeather.coord.lon + delta
                    };

                    return bboxEdges.west + '%2C' + bboxEdges.south + '%2C' + bboxEdges.east + '%2C' + bboxEdges.north;
                }
                return '';
            }
        }
    });
};