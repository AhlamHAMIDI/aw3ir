window.onload = function () {
  console.log("DOM ready!");

  document.querySelector("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let valid = true;
    let errorMessage = "";
  
    const firstName = document.querySelector("#firstName").value.trim();
    const lastName = document.querySelector("#lastName").value.trim();
    const birthday = document.querySelector("#birthday").value.trim();
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();
  
    if (firstName.length < 4) {
      valid = false;
      errorMessage += "Le prénom doit contenir au moins 4 caractères.\n";
    }
    if (lastName.length < 4) {
      valid = false;
      errorMessage += "Le nom doit contenir au moins 4 caractères.\n";
    }
    if (!validateEmail(email)) {
      valid = false;
      errorMessage += "Adresse email invalide.\n";
    }
    if (new Date(birthday).getTime() > Date.now()) {
      valid = false;
      errorMessage += "La date de naissance ne peut pas être dans le futur.\n";
    }
    if (address.length < 10) {
      valid = false;
      errorMessage += "L'adresse doit contenir au moins 10 caractères.\n";
    }
  
    if (!valid) {
      alert(errorMessage); // Pour déboguer plus simplement
      return;
    }
  
    contactStore.add(lastName, firstName, birthday, address, email);
     // Réinitialiser les champs du formulaire
  document.querySelector("#contactForm").reset();

  // Réinitialiser les compteurs de caractères
  document.querySelectorAll(".char-count").forEach((span) => (span.textContent = ""));
    // Cacher le message de succès après une durée de 3 secondes
    const successMessage = document.querySelector("#successMessage");
    successMessage.classList.remove("d-none");
    setTimeout(() => successMessage.classList.add("d-none"), 3000);
      // Mettre à jour l'affichage de la liste des contacts

    displayContactList();
  });
  

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


function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  const span = input.closest(".mb-3").querySelector(".char-count"); // Cherche le <span> correspondant//const span = input.nextElementSibling;
  if (span) {
    span.textContent = `${input.value.length} car.`;
  }
}


document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => calcNbChar(input.id));
});


document.querySelector("#contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const firstname = document.querySelector("#firstname").value;
  const date = document.querySelector("#dob").value;
  const address = document.querySelector("#address").value;
  const email = document.querySelector("#email").value;

  contactStore.add(name, firstname, date, address, email);
  displayContactList();
});

function displayContactList() {
  const contactList = contactStore.getList();
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // Efface l'ancien contenu

  for (const contact of contactList) {
    const googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}`;

    tbody.innerHTML += `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td><a href="${googleMapsLink}" target="_blank">${contact.address}</a></td>
        <td><a href="mailto:${contact.email}">${contact.email}</a></td>
      </tr>`;
  }
}

window.onload = function () {
  displayContactList();
};

document.querySelector(".btn-danger").addEventListener("click", function () {
  contactStore.reset();
  displayContactList();
});

};
