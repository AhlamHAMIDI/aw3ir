// gps.js - Géolocalisation avec OpenStreetMap (gratuit)

function getLocation() {
    const addressInput = document.querySelector("#address");
    const address = addressInput.value.trim();
    
    if (!address) {
        // Géolocalisation du navigateur
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            showMessage("Géolocalisation non supportée par ce navigateur", "warning");
        }
    } else {
        // Conversion d'adresse en coordonnées
        geocodeAddress(address);
    }
}

function geocodeAddress(address) {
    showLoading("Recherche de l'adresse...");
    
    // API Nominatim (OpenStreetMap) - Gratuit
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const result = data[0];
                const lat = result.lat;
                const lon = result.lon;
                
                // Mettre à jour le champ d'adresse
                document.querySelector("#address").value = `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`;
                
                // Afficher les résultats
                displayResults(result, lat, lon);
            } else {
                showMessage("Adresse non trouvée. Vérifiez l'orthographe.", "warning");
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showMessage("Erreur de connexion. Vérifiez votre internet.", "danger");
        });
}

function displayResults(result, lat, lon) {
    const address = formatAddress(result);
    
    document.querySelector("#map").innerHTML = `
        <div class="card mt-3">
            <div class="card-header bg-primary text-white">
                <strong>📍 Localisation trouvée</strong>
            </div>
            <div class="card-body">
                <!-- Coordonnées -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Coordonnées GPS:</strong>
                        <div class="alert alert-secondary py-2 mt-1">
                            <code class="fs-6">${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}</code>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <strong>Adresse:</strong>
                        <div class="alert alert-light py-2 mt-1">
                            ${address}
                        </div>
                    </div>
                </div>
                
                <!-- Carte OpenStreetMap -->
                <div class="mt-3">
                    <strong>Carte:</strong>
                    <div class="mt-2 border rounded">
                        <iframe
                            width="100%"
                            height="300"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=${calculateBbox(lon, lat)}&amp;layer=mapnik&amp;marker=${lat},${lon}"
                            style="border: none; border-radius: 4px;">
                        </iframe>
                    </div>
                    
                    <!-- Lien vers OpenStreetMap -->
                    <div class="text-center mt-2">
                        <small>
                            <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}" 
                               target="_blank" class="btn btn-sm btn-outline-primary">
                               <i class="bi bi-arrows-fullscreen"></i> Voir en plein écran
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showPosition(position) {
    const lat = position.coords.latitude.toFixed(6);
    const lon = position.coords.longitude.toFixed(6);

    // Mettre à jour le champ
    document.querySelector("#address").value = `${lat}, ${lon}`;

    // Afficher la position actuelle
    displayCurrentPosition(lat, lon);
}

function displayCurrentPosition(lat, lon) {
    document.querySelector("#map").innerHTML = `
        <div class="card mt-3">
            <div class="card-header bg-success text-white">
                <strong>📍 Votre position actuelle</strong>
            </div>
            <div class="card-body">
                <!-- Coordonnées -->
                <div class="alert alert-success text-center mb-3">
                    <strong>Coordonnées GPS:</strong><br>
                    <code class="fs-5">${lat}, ${lon}</code>
                </div>
                
                <!-- Carte -->
                <div class="mt-3">
                    <strong>Carte:</strong>
                    <div class="mt-2 border rounded">
                        <iframe
                            width="100%"
                            height="300"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=${calculateBbox(lon, lat)}&amp;layer=mapnik&amp;marker=${lat},${lon}"
                            style="border: none; border-radius: 4px;">
                        </iframe>
                    </div>
                    
                    <div class="text-center mt-2">
                        <small class="text-muted">
                            Position détectée via votre navigateur
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour calculer le bounding box
function calculateBbox(lon, lat, radius = 0.01) {
    const lonNum = parseFloat(lon);
    const latNum = parseFloat(lat);
    
    const minLon = (lonNum - radius).toFixed(6);
    const minLat = (latNum - radius).toFixed(6);
    const maxLon = (lonNum + radius).toFixed(6);
    const maxLat = (latNum + radius).toFixed(6);
    
    return `${minLon},${minLat},${maxLon},${maxLat}`;
}

// Fonction pour formater l'adresse
function formatAddress(result) {
    if (result.address) {
        const addr = result.address;
        let lines = [];
        
        if (addr.road) {
            if (addr.house_number) {
                lines.push(`${addr.house_number} ${addr.road}`);
            } else {
                lines.push(addr.road);
            }
        }
        
        if (addr.postcode && addr.city) {
            lines.push(`${addr.postcode} ${addr.city}`);
        } else if (addr.city) {
            lines.push(addr.city);
        }
        
        if (addr.country) {
            lines.push(addr.country);
        }
        
        return lines.join('<br>');
    }
    
    // Fallback si pas d'address details
    const parts = result.display_name.split(',').map(p => p.trim());
    return parts.slice(0, 4).join('<br>');
}

function showError(error) {
    let message = "Erreur inconnue";
    
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "Accès à la localisation refusé. Autorisez-la dans les paramètres de votre navigateur.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Position indisponible.";
            break;
        case error.TIMEOUT:
            message = "Délai de localisation dépassé.";
            break;
    }
    
    showMessage(message, "warning");
}

function showLoading(text = "Chargement...") {
    document.querySelector("#map").innerHTML = `
        <div class="text-center mt-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-2 text-muted">${text}</p>
        </div>
    `;
}

function showMessage(message, type = "info") {
    const icons = {
        warning: "⚠️",
        danger: "❌",
        info: "ℹ️",
        success: "✅"
    };
    
    document.querySelector("#map").innerHTML = `
        <div class="alert alert-${type} mt-3">
            ${icons[type] || "ℹ️"} ${message}
        </div>
    `;
}

// Initialisation
console.log("GPS.js chargé - OpenStreetMap actif");