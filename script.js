document.addEventListener("DOMContentLoaded", function () {
    // ABOUT SECTION
    const aboutSection = document.getElementById("about");
    const aboutPopup = document.getElementById("about-popup");
    const closeBtn = document.getElementById("close-btn");
    const typingTextElement = document.getElementById("typing-text");

    const text = `I’m a web developer skilled in JavaScript, Django, and React. 
    I specialize in building dynamic, responsive, and user-friendly web applications.
    I am currently pursuing my Master’s in Computer Applications (MCA) and continuously 
    improving my skills by working on full-stack projects and exploring new technologies.`;

    let index = 0;
    const speed = 50;

    function typeWriter() {
        if (index < text.length) {
            typingTextElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            typingTextElement.style.borderRight = "none";
        }
    }

    aboutSection.addEventListener("click", function () {
        aboutPopup.classList.add("active");
        typingTextElement.innerHTML = "";
        index = 0;
        typeWriter();
    });

    closeBtn.addEventListener("click", function () {
        aboutPopup.classList.remove("active");
    });

    document.addEventListener("click", function (event) {
        if (!aboutPopup.contains(event.target) && !aboutSection.contains(event.target)) {
            aboutPopup.classList.remove("active");
        }
    });

    // CONTACT FORM HANDLING
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

        fetch("https://profile-htxo.onrender.com/send-email", { 
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
            statusMessage.textContent = "❌ Failed to connect to the server. Check the backend.";
            statusMessage.style.color = "red";
            statusMessage.style.display = "block";
        });
    });
});
