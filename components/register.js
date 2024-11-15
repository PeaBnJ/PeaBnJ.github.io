import { supabase } from '../supabase-utils.js'; // Importing the Supabase client

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Get the email and password values from the form
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        // Register the user with Supabase
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Error registering:", error.message);
            alert("Error registering: " + error.message);
        } else {
            console.log("Registration successful:", user);
            alert("Registration successful! Please check your email to verify your account.");
            // Optionally, redirect to login or homepage after registration
            window.location.href = '/'; // Redirect to the homepage (index.html)
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("Unexpected error: " + error.message);
    }
});

// Close registration modal when close button is clicked
document.getElementById("closeRegisterModal").addEventListener("click", () => {
    document.getElementById("registerModal").style.display = "none";
});
