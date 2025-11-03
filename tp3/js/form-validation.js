window.onload = function () {
    console.log("DOM ready!");

    // Ajout de l'écouteur d'événement pour le formulaire
    document.querySelector("#myForm").addEventListener("submit", function (event) {
      event.preventDefault();  // Empêcher l'envoi du formulaire

      let valid = true;        // Variable de validation
      let errorMessage = "";   // Variable pour stocker les messages d'erreur

      // Récupérer les valeurs des champs
      let firstName = document.querySelector("#firstName").value;
      let lastName = document.querySelector("#lastName").value;
      let birthday = document.querySelector("#birthday").value;
      let email = document.querySelector("#email").value;
      let address = document.querySelector("#address").value;

      // Validation des champs
      if (!firstName || firstName.length < 5) {
        valid = false;
        errorMessage += "Le champ 'Prénom' doit avoir au moins 5 caractères.\n";
      }

      if (!lastName || lastName.length < 5) {
        valid = false;
        errorMessage += "Le champ 'Nom' doit avoir au moins 5 caractères.\n";
      }

      if (!validateEmail(email)) {
        valid = false;
        errorMessage += "L'adresse email est invalide.\n";
      }

      let birthdayDate = new Date(birthday);
      if (!birthday || birthdayDate.getTime() > Date.now()) {
        valid = false;
        errorMessage += "La date de naissance ne doit pas être dans le futur.\n";
      }

      if (!address || address.length < 5) {
        valid = false;
        errorMessage += "L'adresse postale doit comporter au moins 5 caractères.\n";
      }

      // Si un champ est vide ou invalide, afficher le popup d'erreur
      if (!valid) {
        showModal("Erreur de validation", errorMessage);
      } else {
        // Si tout est valide, afficher le modal de succès
        var myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();

        //  Remplir le modal avec les informations utilisateur
        document.getElementById("modalBody").innerHTML = `
          <a href="http://maps.google.com/maps?q=${address}" target="_blank">
            <img src="https://maps.googleapis.com/maps/api/staticmap?markers=${address}&zoom=14&size=400x300&scale=2&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg" alt="Google Maps">
          </a>
          <p><strong>Adresse postale : </strong>${address}</p>
        `;
        document.querySelector("#exampleModalLabel").textContent = `Bonjour ${firstName} ${lastName}, vous êtes né(e) le ${birthday} et vous habitez à :`;
      }
    });
};

// Fonction pour valider l'email
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

// Fonction pour afficher la modal d'erreur
function showModal(title, message) {
  document.querySelector(".modal-title").textContent = title;
  document.querySelector(".modal-body").textContent = message;

  var errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}