// ========================================
// AUTHENTICATION SYSTEM
// ========================================


// ========================================
// HELPER FUNCTIONS
// ========================================

function getUsers() {
    return JSON.parse(localStorage.getItem("authUsers")) || [];
}


function saveUsers(users) {
    localStorage.setItem("authUsers", JSON.stringify(users));
}


function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}


function showMessage(element, message) {
    element.textContent = message;
}


// ========================================
// SHA-256 PASSWORD HASHING
// ========================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ========================================
// PASSWORD VALIDATION
// ========================================

function isValidPassword(password) {

    const minimumLength = password.length >= 8;

    const containsNumber = /\d/.test(password);

    return minimumLength && containsNumber;
}


// ========================================
// REGISTER PAGE
// ========================================

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const username =
            document.getElementById("register-username")
                .value
                .trim();

        const email =
            document.getElementById("register-email")
                .value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("register-password")
                .value;

        const confirmPassword =
            document.getElementById("confirm-password")
                .value;

        const message =
            document.getElementById("register-message");


        // -------------------------------
        // EMPTY FIELD VALIDATION
        // -------------------------------

        if (
            username === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            showMessage(
                message,
                "Please fill in all fields."
            );

            return;
        }


        // -------------------------------
        // EMAIL VALIDATION
        // -------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                message,
                "Please enter a valid email address."
            );

            return;
        }


        // -------------------------------
        // PASSWORD VALIDATION
        // -------------------------------

        if (!isValidPassword(password)) {

            showMessage(
                message,
                "Password must contain at least 8 characters and 1 number."
            );

            return;
        }


        // -------------------------------
        // CONFIRM PASSWORD
        // -------------------------------

        if (password !== confirmPassword) {

            showMessage(
                message,
                "Passwords do not match."
            );

            return;
        }


        // -------------------------------
        // GET EXISTING USERS
        // -------------------------------

        const users = getUsers();


        // -------------------------------
        // DUPLICATE CHECK
        // -------------------------------

        const userExists = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );


        if (userExists) {

            showMessage(
                message,
                "An account with that username or email already exists."
            );

            return;
        }


        // -------------------------------
        // HASH PASSWORD
        // -------------------------------

        const hashedPassword =
            await hashPassword(password);


        // -------------------------------
        // CREATE USER
        // -------------------------------

        const newUser = {

            username: username,

            email: email,

            password: hashedPassword

        };


        users.push(newUser);

        saveUsers(users);


        // -------------------------------
        // SUCCESS
        // -------------------------------

        showMessage(
            message,
            "Registration successful! Redirecting to login..."
        );


        registerForm.reset();


        setTimeout(() => {

            window.location.href = "index.html";

        }, 1200);

    });
}


// ========================================
// LOGIN PAGE
// ========================================

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const identifier =
            document.getElementById("login-identifier")
                .value
                .trim();

        const password =
            document.getElementById("login-password")
                .value;

        const message =
            document.getElementById("login-message");


        // -------------------------------
        // EMPTY FIELD VALIDATION
        // -------------------------------

        if (
            identifier === "" ||
            password === ""
        ) {

            showMessage(
                message,
                "Please enter your username/email and password."
            );

            return;
        }


        // -------------------------------
        // GET USERS
        // -------------------------------

        const users = getUsers();


        // -------------------------------
        // HASH ENTERED PASSWORD
        // -------------------------------

        const hashedPassword =
            await hashPassword(password);


        // -------------------------------
        // FIND USER
        // -------------------------------

        const user = users.find(user =>

            (
                user.username.toLowerCase() ===
                identifier.toLowerCase()
            ||
                user.email.toLowerCase() ===
                identifier.toLowerCase()
            )

            &&
            user.password === hashedPassword

        );


        // -------------------------------
        // INVALID LOGIN
        // -------------------------------

        if (!user) {

            showMessage(
                message,
                "Invalid username/email or password."
            );

            return;
        }


        // -------------------------------
        // CREATE SESSION
        // -------------------------------

        const currentUser = {

            username: user.username,

            email: user.email

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        // -------------------------------
        // REDIRECT
        // -------------------------------

        window.location.href = "dashboard.html";

    });
}


// ========================================
// DASHBOARD PAGE
// ========================================

const dashboardUsername =
    document.getElementById("dashboard-username");


if (dashboardUsername) {

    const currentUser = getCurrentUser();


    // -------------------------------
    // PROTECT DASHBOARD
    // -------------------------------

    if (!currentUser) {

        window.location.href = "index.html";

    } else {

        document.getElementById("dashboard-username")
            .textContent = currentUser.username;

        document.getElementById("user-username")
            .textContent = currentUser.username;

        document.getElementById("user-email")
            .textContent = currentUser.email;

    }
}


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logout-button");


if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    });
}