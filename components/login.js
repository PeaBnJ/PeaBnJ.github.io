import { supabase } from '../supabase-utils.js';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Get email and password values
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        // Log in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Error logging in:", error.message);
            alert("Error logging in: " + error.message);
        } else {
            console.log("Login successful:", data);
            alert("Login successful!");
            // Optionally, redirect to the homepage or dashboard after successful login
            window.location.href = '/'; // Redirecting to the home page (index.html)
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("Unexpected error: " + error.message);
    }
});

// Close login modal when close button is clicked
document.getElementById("closeLoginModal").addEventListener("click", () => {
    document.getElementById("loginModal").style.display = "none";
});
