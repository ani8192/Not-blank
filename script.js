const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

// Form Submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (username.value.trim() === "" || password.value.trim() === "") {
        message.style.color = "red";
        message.textContent = "Please fill in all fields!";
    } else {
        message.style.color = "green";
        message.textContent = "Login successful!";
        
        // You can redirect here if needed
        // window.location.href = "dashboard.html";
    }
});

// Show / Hide Password
togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
});