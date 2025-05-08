// /home/ubuntu/hand_game_backend/index.js
const express = require("express");
const { calculateRoundScores } = require("./calculator");

const app = express();
const port = process.env.PORT || 3001; // Backend server port

app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Hand Game Score Calculator Backend is running!");
});

// API endpoint to calculate scores
app.post("/api/calculate-scores", (req, res) => {
    const { handType, players } = req.body;

    if (!handType || !players) {
        return res.status(400).json({ error: "Missing handType or players in request body" });
    }
    console.log("Received:", { handType, players });
    try {
        const scores = calculateRoundScores(handType, players);
        res.json(scores);
    } catch (error) {
        console.error("Calculation error:", error.message); // 
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

// Example usage for testing the calculator logic directly
function testCalculator() {
    console.log("Testing calculator logic...");

    // Test case 1: Normal Hand
    try {
        const players1 = [
            { name: "Player A", status: "winner" },
            { name: "Player B", status: "did_not_go_down" },
            { name: "Player C", status: "went_down", cardValueSum: 50 }, // e.g., sum of cards + joker (20)
            { name: "Player D", status: "made_mistake" }
        ];
        const scores1 = calculateRoundScores("normal", players1);
        console.log("Normal Hand Scores:", scores1);
        // Expected: Player A: -30, Player B: 100, Player C: 50*2=100, Player D: 150
    } catch (e) {
        console.error("Test Case 1 Error:", e.message);
    }

    // Test case 2: Colored Hand
    try {
        const players2 = [
            { name: "Player X", status: "winner" },
            { name: "Player Y", status: "went_down", cardValueSum: 30 },
            { name: "Player Z", status: "did_not_go_down" },
            { name: "Player W", status: "went_down", cardValueSum: 10 }
        ];
        const scores2 = calculateRoundScores("colored", players2);
        console.log("Colored Hand Scores:", scores2);
        // Expected: Player X: -60, Player Y: 30*4=120, Player Z: 200, Player W: 10*4=40
    } catch (e) {
        console.error("Test Case 2 Error:", e.message);
    }

    // Test case 3: Invalid Hand Type
    try {
        const players3 = [{ name: "Test", status: "winner" }];
        calculateRoundScores("invalid_hand", players3);
    } catch (e) {
        console.log("Test Case 3 (Invalid Hand Type) Error:", e.message);
    }

    // Test case 4: Missing cardValueSum for 'went_down'
    try {
        const players4 = [
            { name: "Player E", status: "winner" },
            { name: "Player F", status: "went_down" } // Missing cardValueSum
        ];
        calculateRoundScores("normal", players4);
    } catch (e) {
        console.log("Test Case 4 (Missing cardValueSum) Error:", e.message);
    }
    
    // Test case 5: Double Jokery Colored
    try {
        const players5 = [
            { name: "Player G", status: "winner" },
            { name: "Player H", status: "did_not_go_down" },
            { name: "Player I", status: "went_down", cardValueSum: 15 },
            { name: "Player J", status: "made_mistake" }
        ];
        const scores5 = calculateRoundScores("double_jokery_colored", players5);
        console.log("Double Jokery Colored Hand Scores:", scores5);
        // Expected: Player G: -240, Player H: 800, Player I: 15*32=480, Player J: 1200
    } catch (e) {
        console.error("Test Case 5 Error:", e.message);
    }

     // Test case 6: More than one winner
    try {
        const players6 = [
            { name: "Player K", status: "winner" },
            { name: "Player L", status: "winner" },
            { name: "Player M", status: "went_down", cardValueSum: 10 },
            { name: "Player N", status: "did_not_go_down" }
        ];
        calculateRoundScores("normal", players6);
    } catch (e) {
        console.log("Test Case 6 (Multiple Winners) Error:", e.message);
    }
}

// Run tests if the script is executed directly (e.g., node index.js test)
if (process.argv[2] === "test") {
    testCalculator();
} else {
    // Start the server if not in test mode
    // No app.listen here, it will be started by a separate command for the backend server
}

module.exports = app; // Export app for testing or if run by a different script

