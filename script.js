document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const statusMessage = document.getElementById("status-message");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            statusMessage.textContent = "❌ Please fill in all fields!";
            statusMessage.style.color = "red";
            statusMessage.style.display = "block";
            return;
        }

        // Send data to the Flask backend (Deployed on Render)
        fetch("https://profile-htxo.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                statusMessage.textContent = "✅ Your message has been sent successfully!";
                statusMessage.style.color = "#3ebcf6";
                contactForm.reset();
            } else {
                statusMessage.textContent = "❌ An error occurred. Please try again later.";
                statusMessage.style.color = "red";
            }
            statusMessage.style.display = "block";
        })
        .catch(error => {
            console.error(error);
            statusMessage.textContent = "❌ An error occurred. Please try again later.";
            statusMessage.style.color = "red";
            statusMessage.style.display = "block";
        });
    });
});
