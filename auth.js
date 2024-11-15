// Import supabase instance
import { supabase } from './supabase-utils.js'; // Adjust the path if needed

// Function to save user progress to Supabase
async function saveUserProgress(paragraphLocation, filledInWords) {
    // Get the user from Supabase auth
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error('Error getting user:', userError?.message || 'User not found');
        return;
    }
    
    // Check if user ID is available
    if (!user.id) {
        console.error('User ID is not available');
        return;
    }

    // Save user progress in 'user_progress'
    const { data: userProgressData, error: userProgressError } = await supabase
        .from('user_progress')
        .upsert({ 
            user_id: user.id, 
            paragraph_location: paragraphLocation // Save paragraph location (or order)
        })
        .select('id'); // Get the inserted/updated user_progress ID

    if (userProgressError) {
        console.error('Error saving user progress:', userProgressError.message);
        return;
    }

    // Insert filled words into 'filled_words'
    if (userProgressData && userProgressData[0]) {
        const userProgressId = userProgressData[0].id;

        // Assuming filledInWords is an array of word IDs, save each filled word
        const filledWordsData = filledInWords.map(word => ({
            user_progress_id: userProgressId,
            word_id: word,
        }));

        const { data: filledWords, error: filledWordsError } = await supabase
            .from('filled_words')
            .upsert(filledWordsData);

        if (filledWordsError) {
            console.error('Error saving filled words:', filledWordsError.message);
        } else {
            console.log('Filled words saved:', filledWords);
        }
    }
}

// Function to load user progress from Supabase
async function loadUserProgress() {
    // Get the user from Supabase auth
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error('Error getting user:', userError?.message || 'User not found');
        return;
    }

    // Check if user ID is available
    if (!user.id) {
        console.error('User ID is not available');
        return;
    }

    // Load user progress from 'user_progress'
    const { data, error } = await supabase
        .from('user_progress')
        .select('paragraph_location') // Just load the paragraph_location
        .eq('user_id', user.id)
        .single(); // Assumes one record per user

    if (error) {
        console.error('Error loading user progress:', error.message);
    } else {
        console.log('User progress loaded:', data);
        return data; // Returns the loaded progress
    }
}

// Function to handle the filling in of blanks or moving paragraphs
async function handleUserInteraction() {
    // Example: Detecting when a user fills in a blank
    const filledInWords = [];
    document.querySelectorAll('.blank').forEach(blank => {
        // Example: Assuming blanks have class "blank" and are text inputs
        if (blank.value) {
            filledInWords.push(blank.value);
        }
    });

    // Detecting paragraph movement (masih error)
    const paragraphLocation = getParagraphLocation();

    // Call saveUserProgress to store the progress after each interaction
    await saveUserProgress(paragraphLocation, filledInWords);
}

// Attach event listeners for actions like filling in blanks or moving paragraphs
document.querySelectorAll('.blank').forEach(blank => {
    blank.addEventListener('input', handleUserInteraction); // Save after filling a blank
});

// 
document.querySelectorAll('.paragraph').forEach(paragraph => {
    paragraph.addEventListener('dragend', handleUserInteraction); // Save after moving a paragraph
});

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Login error:", error.message);
            showAlert("Error logging in: " + error.message);
        } else {
            console.log("Login successful:", data);
            showAlert("Login successful!");
            // Close the login modal upon success
            document.getElementById('loginModal').style.display = 'none';
            toggleAuthLinks(true);  // Show logout, hide login/register links

            // Load user progress upon login
            const userProgress = await loadUserProgress();
            if (userProgress) {
                // Update UI with saved user progress
                console.log('User progress:', userProgress);
                // Use the userProgress (paragraph_location) in your app
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        showAlert("Unexpected error: " + error.message);
    }
});

// Handle register form submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Registration error:", error.message);
            showAlert("Error registering: " + error.message);
        } else {
            console.log("Registration successful:", data);
            showAlert("Registration successful! Please check your email to verify.");
            // Close the register modal upon success
            document.getElementById('registerModal').style.display = 'none';
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        showAlert("Unexpected error: " + error.message);
    }
});

// Handle logout
document.getElementById("logoutLink").addEventListener("click", async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout error:", error.message);
    } else {
        console.log("Logout successful");
        toggleAuthLinks(false);  // Hide logout, show login/register links
    }
});

// Refresh session on page load or when needed
async function refreshSession() {
    try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error("Session refresh error:", error.message);
        } else {
            const { session, user } = data;
            console.log("Session refreshed:", session);
            console.log("Logged in user:", user);
            toggleAuthLinks(!!session);  // Update UI based on session status

            if (session) {
                // Load user progress if logged in
                const userProgress = await loadUserProgress();
                if (userProgress) {
                    console.log('User progress on page load:', userProgress);
                    // Update the UI based on userProgress
                }
            }
        }
    } catch (error) {
        console.error("Unexpected error during session refresh:", error);
    }
}

// Refresh session on page load to ensure the user is properly authenticated
document.addEventListener("DOMContentLoaded", () => {
    refreshSession();
});

// Utility function to show alerts in the popup modal
function showAlert(message) {
    const popupMessage = document.getElementById("popupMessage");
    popupMessage.textContent = message;
    document.getElementById("popupModal").style.display = "flex";
}

// Toggle visibility of authentication links (login, register, logout)
function toggleAuthLinks(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("registerLink").style.display = "none";
        document.getElementById("logoutLink").style.display = "inline";  // Show logout
    } else {
        document.getElementById("loginLink").style.display = "inline";  // Show login
        document.getElementById("registerLink").style.display = "inline"; // Show register
        document.getElementById("logoutLink").style.display = "none";    // Hide logout
    }
}
