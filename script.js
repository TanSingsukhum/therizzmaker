const sampleProfiles = [
    { name: "Alex", age: 25, gender: "men", interests: "Hiking, Reading" },
    { name: "Jordan", age: 28, gender: "women", interests: "Cooking, Traveling" },
    { name: "Taylor", age: 22, gender: "women", interests: "Gaming, Music" },
    { name: "Casey", age: 30, gender: "men", interests: "Fitness, Yoga" },
    { name: "Jake", age: 22, gender: "women", interests: "Soccer, Music" },
    { name: "Luke", age: 22, gender: "women", interests: "Anime, Music" },
    { name: "Kaily", age: 22, gender: "women", interests: "One Piece, Music" },
    { name: "John", age: 22, gender: "women", interests: "Leetcode, Music" },
];

let currentUser = null;
let currentProfileIndex = 0;
let chatActive = false;
let lastMessage = ""; // Track the last message to avoid repeating responses
let matchedProfile = null;

// Handle profile form submission
document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const interests = document.getElementById("interests").value;
    const genderPreference = document.getElementById("genderPreference").value;

    if (username && age && interests) {
        currentUser = { name: username, age: age, interests: interests, genderPreference: genderPreference };
        document.querySelector(".user-profile").style.display = "none";
        document.querySelector(".matches-container").style.display = "block";
        displayMatch();
    }
});

// Function to display the match profile
function displayMatch() {
    while (currentProfileIndex < sampleProfiles.length) {
        const profile = sampleProfiles[currentProfileIndex];
        if (
            currentUser.genderPreference === "both" ||
            currentUser.genderPreference === profile.gender
        ) {
            const profileDisplay = document.getElementById("profileDisplay");
            const avatar = generateRandomAvatar();
            profileDisplay.innerHTML = `
                <canvas id="avatarCanvas" width="100" height="100"></canvas>
                <h3>${profile.name}</h3>
                <p>Age: ${profile.age}</p>
                <p>Interests: ${profile.interests}</p>
            `;
            drawAvatar();
            matchedProfile = profile; // Store the matched profile
            break;
        } else {
            currentProfileIndex++;
        }
    }
}

// Function to generate random 2D pixel avatars on canvas
function generateRandomAvatar() {
    const colors = ['#FF6347', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Draw a simple pixelated avatar on canvas
function drawAvatar() {
    const canvas = document.getElementById("avatarCanvas");
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2);
    ctx.fillStyle = generateRandomAvatar();
    ctx.fill();
    ctx.closePath();

    if (Math.random() > 0.5) {
        ctx.beginPath();
        ctx.arc(50, 35, 15, Math.PI, 0, true); 
        ctx.fillStyle = '#000'; 
        ctx.fill();
        ctx.closePath();
    }
}

// Like button functionality
document.getElementById("likeBtn").addEventListener("click", function () {
    if (matchedProfile) {
        if (Math.random() < 0.3) {
            document.getElementById("status").innerHTML = `You matched with ${matchedProfile.name}! Start chatting!`;
            document.querySelector(".matches-container").style.display = "none";
            document.querySelector(".chat-container").style.display = "block";
            chatActive = true;
            startChat(matchedProfile);
        } else {
            document.getElementById("status").innerHTML = `You liked ${matchedProfile.name}. Try again!`;
        }
        currentProfileIndex++;
        setTimeout(displayMatch, 1000); // Show next match after 1 second
    }
});

// Dislike button functionality
document.getElementById("dislikeBtn").addEventListener("click", function () {
    if (matchedProfile) {
        document.getElementById("status").innerHTML = `You disliked ${matchedProfile.name}.`;
        currentProfileIndex++;
        setTimeout(displayMatch, 1000); // Show next match after 1 second
    }
});

// Function to start chat with matched person
function startChat(profile) {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = `<p>You're now chatting with ${profile.name}!</p>`;
    document.getElementById("sendBtn").addEventListener("click", function () {
        const message = document.getElementById("chatInput").value;
        if (message) {
            chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
            document.getElementById("chatInput").value = "";
            chatBox.scrollTop = chatBox.scrollHeight;
            // AI response after user message
            generateAIResponse(profile, message);
        }
    });

    // Start AI response for the matched profile
    setTimeout(() => generateAIResponse(profile, 'Hi there!'), 2000);
}

// AI response generator with personality
function generateAIResponse(profile, userMessage) {
    let aiResponse = "";

    // Avoid repetitive responses
    if (userMessage.toLowerCase().includes('hiking')) {
        aiResponse = `${profile.name}: That sounds awesome! Do you prefer mountain hiking or more forest trails?`;
    } else if (userMessage.toLowerCase().includes('favorite')) {
        aiResponse = `${profile.name}: My favorite trail has to be in the Rockies. What's yours?`;
    } else {
        // Default responses
        const randomResponses = [
            `${profile.name}: That's cool, tell me more!`,
            `${profile.name}: Haha, sounds interesting!`,
            `${profile.name}: I love that! What's your favorite part about it?`,
            `${profile.name}: I didn't know that! Tell me more!`
        ];
        aiResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }

    // Avoid repeating the same response
    if (lastMessage === aiResponse) {
        aiResponse = generateAIResponse(profile, userMessage); // Recurse if same message
    }

    lastMessage = aiResponse; // Update last message
    document.getElementById("chatBox").innerHTML += `<p><strong>${profile.name}:</strong> ${aiResponse}</p>`;
    document.getElementById("chatBox").scrollTop = chatBox.scrollHeight;

    // Simulate the other person deciding whether they like or dislike you
    simulateLikeDislikeResponse(profile);
}

// Simulate the other person liking or disliking you
function simulateLikeDislikeResponse(profile) {
    setTimeout(() => {
        const response = Math.random() < 0.5 ? 'like' : 'dislike';
        const responseText = response === 'like' 
            ? `${profile.name} likes you!` 
            : `${profile.name} dislikes you.`;
        document.getElementById("chatBox").innerHTML += `<p><strong>${profile.name}:</strong> ${responseText}</p>`;
        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
    }, 3000); // Wait 3 seconds before sending a like or dislike
}
