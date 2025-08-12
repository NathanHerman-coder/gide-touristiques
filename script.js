const form = document.getElementById("contact-form");
const responseMessage = document.getElementById("response-message");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    responseMessage.textContent = result.message || "Message envoyé !";
    form.reset();
  })
  .catch(error => {
    responseMessage.textContent = "Erreur lors de l'envoi.";
    console.error("Erreur:", error);
  });
});
