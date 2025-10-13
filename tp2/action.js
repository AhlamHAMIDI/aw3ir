// Fonction pour lire les données de l'URL et valoriser les éléments HTML
function displayFormData() {
  // Extraction des paramètres de l'URL
  const urlParams = new URLSearchParams(document.location.search);

  // Assignation des valeurs aux éléments HTML par leur ID
  document.getElementById("nom").textContent = urlParams.get("nom") || "Nom non fourni";
  document.getElementById("prenom").textContent = urlParams.get("prenom") || "Prénom non fourni";
  document.getElementById("date_naissance").textContent = urlParams.get("date_naissance") || "Date de naissance non fournie";

  const address = urlParams.get("adresse") || "Adresse non fournie";
  const addressElement = document.getElementById("adresse");
  addressElement.textContent = address;
  addressElement.href = `https://maps.google.com/?q=${encodeURIComponent(adresse)}`;

  const email = urlParams.get("email") || "Email non fourni";
  const emailElement = document.getElementById("email");
  emailElement.textContent = email;
  emailElement.href = `mailto:${email}`;
}


window.onload = () => {
  // Récupère les paramètres de l'URL
  const paramsString = document.location.search;
  const searchParams = new URLSearchParams(paramsString);

  // Boucle sur chaque paramètre pour mettre à jour les éléments HTML
  for (const param of searchParams) {
    const elementId = param[0];       // Nom du paramètre (ex: "nom")
    const elementValue = param[1];    // Valeur du paramètre (ex: "Dupont")
    const element = document.getElementById(elementId); // Cible l'élément HTML par son id

    if (element !== null) {
      element.textContent = elementValue; // Définit le contenu texte de l'élément
    }

    // Spécificités pour "adresse" et "email"
    if (elementId === "adresse") {
      element.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(elementValue)}`;
    } else if (elementId === "email") {
      element.href = `mailto:${elementValue}?subject=Hello!&body=What's up?`;
    }
  }
};
