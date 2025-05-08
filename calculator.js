// /home/ubuntu/hand_game_backend/calculator.js

const SCORE_RULES = {
    "normal": {
        winner: -60,
        did_not_go_down: 200,
        went_down_multiplier: 2, // ضعف قيمة الاوراق
        made_mistake: 250
    },
    "colored": {
        winner: -120,
        did_not_go_down: 400,
        went_down_multiplier: 4,
        made_mistake: 450
    },
    "jokery": {
        winner: -120,
        did_not_go_down: 400,
        went_down_multiplier: 4,
        made_mistake: 450
    },
    "jokery_colored": {
        winner: -240,
        did_not_go_down: 800,
        went_down_multiplier: 8,
        made_mistake: 850
    },
    "zaat": {
        winner: -400,
        did_not_go_down: 1200,
        went_down_multiplier: 12,
        made_mistake: 1250
    },
    "double_jokery": {
        winner: -240,
        did_not_go_down: 800,
        went_down_multiplier: 8,
        made_mistake: 850
    },
    "double_jokery_colored": {
        winner: -400,
        did_not_go_down: 1200,
        went_down_multiplier: 12,
        made_mistake: 1250
    }
};

/**
 * Calculates the scores for a round of Kuwaiti Hand game.
 * @param {string} handType - The type of hand (e.g., "normal", "colored").
 * @param {Array<Object>} players - Array of player objects.
 * Each player object: { name: string, status: 'winner'|'did_not_go_down'|'went_down'|'made_mistake', cardValueSum?: number }
 * cardValueSum is required if status is 'went_down'. Joker value (20) should be included in this sum by the caller.
 * @returns {Object} - An object mapping player names to their scores for the round.
 * @throws {Error} if handType is invalid or player data is incorrect.
 */
function calculateRoundScores(handType, players) {
    if (!SCORE_RULES[handType]) {
        throw new Error(`Invalid hand type: ${handType}. Supported types are: ${Object.keys(SCORE_RULES).join(", ")}`);
    }

    if (!Array.isArray(players) || players.length === 0) {
        throw new Error("Players array must be provided and be non-empty.");
    }

    const rules = SCORE_RULES[handType];
    const roundScores = {};
    let winnerCount = 0;

    players.forEach(player => {
        if (!player.name || typeof player.name !== "string") {
            throw new Error("Each player must have a valid name (string).");
        }
        if (!player.status || typeof player.status !== "string") {
            player.status = "did_not_go_down"; // ← التعيين التلقائي
        }
        

        switch (player.status) {
            case "winner":
                roundScores[player.name] = rules.winner;
                winnerCount++;
                break;
            case "did_not_go_down":
                roundScores[player.name] = rules.did_not_go_down;
                break;
            case "went_down":
                if (typeof player.cardValueSum !== "number" || player.cardValueSum < 0) {
                    throw new Error(`Player ${player.name} with status 'went_down' must have a valid non-negative cardValueSum (number).`);
                }
                roundScores[player.name] = player.cardValueSum * rules.went_down_multiplier;
                break;
            case "made_mistake":
                roundScores[player.name] = rules.made_mistake;
                break;
            default:
                throw new Error(`Invalid status '${player.status}' for player ${player.name}. Valid statuses are: winner, did_not_go_down, went_down, made_mistake.`);
        }
    });

    if (winnerCount !== 1) {
        throw new Error("Exactly one player must have the status 'winner'.");
    }

    return roundScores;
}

module.exports = { calculateRoundScores, SCORE_RULES };

