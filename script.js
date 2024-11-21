document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    const response = await fetch("https://jfklmd3esl.execute-api.ap-south-1.amazonaws.com/prod", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        alert("Message sent successfully!");
    } else {
        alert("Error sending message.");
    }
});
