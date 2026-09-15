/* =========================================
   CAMPUSQUEST
   Main JavaScript
========================================= */


/* =========================================
   GAME DATA
========================================= */

const quests = [
    {
        id: 1,
        icon: "📸",
        title: "Campus Explorer",
        description: "Visit any campus location you haven't explored today.",
        xp: 50
    },

    {
        id: 2,
        icon: "🧠",
        title: "Brain Boost",
        description: "Answer today's campus trivia question correctly.",
        xp: 50
    },

    {
        id: 3,
        icon: "🤝",
        title: "Help A Friend",
        description: "Help a classmate with something today.",
        xp: 75
    },

    {
        id: 4,
        icon: "☕",
        title: "Canteen Quest",
        description: "Visit the campus canteen and discover today's special.",
        xp: 40
    },

    {
        id: 5,
        icon: "⚡",
        title: "Speed Demon",
        description: "Complete a challenge in under 30 seconds.",
        xp: 100
    },

    {
        id: 6,
        icon: "👋",
        title: "Social Quest",
        description: "Talk to someone from another department.",
        xp: 60
    }
];


/* =========================================
   PLAYER STATE
========================================= */

let player = JSON.parse(
    localStorage.getItem("campusQuestPlayer")
) || {

    xp: 120,

    questsCompleted: 3,

    streak: 3,

    completedQuests: []

};


/* =========================================
   LEVEL SYSTEM
========================================= */

const levels = [

    {
        name: "Freshie",
        min: 0
    },

    {
        name: "Explorer",
        min: 100
    },

    {
        name: "Campus Pro",
        min: 250
    },

    {
        name: "Campus Legend",
        min: 500
    },

    {
        name: "Campus Master",
        min: 1000
    },

    {
        name: "Campus GOAT",
        min: 2000
    }

];


function getLevel() {

    let current = levels[0];

    for (const level of levels) {

        if (player.xp >= level.min) {
            current = level;
        }

    }

    return current;
}


function getLevelIndex() {

    const current = getLevel();

    return levels.indexOf(current) + 1;

}


/* =========================================
   SAVE PLAYER
========================================= */

function savePlayer() {

    localStorage.setItem(
        "campusQuestPlayer",
        JSON.stringify(player)
    );

}


/* =========================================
   UPDATE UI
========================================= */

function updatePlayerUI() {

    const level = getLevel();

    const levelIndex = getLevelIndex();

    document.getElementById("heroLevel").textContent =
        level.name;

    document.getElementById("navLevel").textContent =
        level.name;

    document.getElementById("levelNumber").textContent =
        String(levelIndex).padStart(2, "0");

    document.getElementById("heroXP").textContent =
        player.xp;

    document.getElementById("heroQuests").textContent =
        player.questsCompleted;

    document.getElementById("wrappedXP").textContent =
        player.xp;

    document.getElementById("wrappedQuests").textContent =
        player.questsCompleted;

    document.getElementById("streak").textContent =
        player.streak;


    /* -----------------------------
       Calculate level progress
    ----------------------------- */

    const currentLevel = level;

    const nextLevel =
        levels[levelIndex] || null;


    let progress;

    let xpText;


    if (nextLevel) {

        const earned =
            player.xp - currentLevel.min;

        const required =
            nextLevel.min - currentLevel.min;

        progress =
            Math.min(
                100,
                (earned / required) * 100
            );

        xpText =
            `${earned} / ${required} XP`;

    } else {

        progress = 100;

        xpText = "MAX LEVEL";

    }


    document.getElementById("xpBar").style.width =
        `${progress}%`;

    document.getElementById("xpText").textContent =
        xpText;


    /* Leaderboard */

    document.getElementById("leaderboardXP").textContent =
        `${player.xp + 1400} XP`;

}


/* =========================================
   RENDER QUESTS
========================================= */

function renderQuests() {

    const container =
        document.getElementById("questContainer");

    container.innerHTML = "";


    quests.forEach(quest => {

        const completed =
            player.completedQuests.includes(quest.id);


        const card =
            document.createElement("div");

        card.className =
            `quest-card ${completed ? "completed" : ""}`;


        card.innerHTML = `

            <div class="quest-icon">
                ${quest.icon}
            </div>

            <h3>${quest.title}</h3>

            <p>
                ${quest.description}
            </p>

            <div class="quest-reward">
                +${quest.xp} XP
            </div>

            <button
                class="quest-button"
                onclick="completeQuest(${quest.id})"
                ${completed ? "disabled" : ""}
            >

                ${completed ? "✓ Completed" : "Complete Quest"}

            </button>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   COMPLETE QUEST
========================================= */

function completeQuest(id) {

    if (player.completedQuests.includes(id)) {

        showToast("Quest already completed!");

        return;

    }


    const quest =
        quests.find(q => q.id === id);


    if (!quest) return;


    player.xp += quest.xp;

    player.questsCompleted++;

    player.completedQuests.push(id);


    savePlayer();

    updatePlayerUI();

    renderQuests();


    showToast(
        `+${quest.xp} XP — Quest Complete! 🎉`
    );


    checkAchievements();

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================
   I'M BORED RANDOMIZER
========================================= */

const activities = [

    "Challenge a friend to Rock Paper Scissors ✊",

    "Go discover a place on campus you've never visited 🗺️",

    "Ask someone from another department about their favorite subject 🤝",

    "Take a funny campus photo 📸",

    "Visit the canteen and try something new 🍔",

    "Find someone wearing your college color 🎨",

    "Solve a coding problem 💻",

    "Play a quick game with your classmates 🎮",

    "Tell a friend a terrible joke 😂",

    "Explore the library and find the oldest-looking book 📚"

];


function randomActivity() {

    const activity =
        activities[
            Math.floor(
                Math.random() *
                activities.length
            )
        ];


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <div style="text-align:center">

            <div style="font-size:55px">
                🎲
            </div>

            <h2>CampusQuest Challenge</h2>

            <p>
                ${activity}
            </p>

            <br>

            <button
                class="btn primary-btn"
                onclick="closeModal()"
            >
                Let's Go! 🚀
            </button>

        </div>

    `;


    openModal();

}


/* =========================================
   MODAL
========================================= */

function openModal() {

    document
        .getElementById("modal")
        .classList.add("active");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("active");

}


document
    .getElementById("modal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeModal();
        }

    });


/* =========================================
   TRIVIA
========================================= */

let triviaCompleted = false;


function checkAnswer(button, correct) {

    if (triviaCompleted) {

        return;

    }


    const buttons =
        document.querySelectorAll(
            "#answers button"
        );


    if (correct) {

        button.classList.add("correct");

        document.getElementById(
            "triviaResult"
        ).textContent =
            "🎉 Correct! You earned +50 XP.";

        document.getElementById(
            "triviaResult"
        ).style.color =
            "#4ade80";


        player.xp += 50;

        savePlayer();

        updatePlayerUI();

        triviaCompleted = true;

        showToast("+50 XP — Quiz Master! 🧠");


        buttons.forEach(btn => {

            btn.disabled = true;

        });

    } else {

        button.classList.add("wrong");

        document.getElementById(
            "triviaResult"
        ).textContent =
            "❌ Not quite. Try again!";

        document.getElementById(
            "triviaResult"
        ).style.color =
            "#f87171";

    }

}


/* =========================================
   CAMPUS MAP
========================================= */

const locations = {

    "Main Building": {

        icon: "🏫",

        description:
            "The heart of the campus. Most important announcements begin here.",

        quest:
            "Find the oldest notice board in the building."

    },


    "Canteen": {

        icon: "🍔",

        description:
            "The unofficial headquarters of campus conversations.",

        quest:
            "Find today's most popular item."

    },


    "Library": {

        icon: "📚",

        description:
            "A quiet zone... at least theoretically.",

        quest:
            "Find a book related to your department."

    },


    "Sports Ground": {

        icon: "⚽",

        description:
            "Where campus rivalries become legendary.",

        quest:
            "Challenge a friend to a quick game."

    },


    "Computer Lab": {

        icon: "💻",

        description:
            "Where bugs are born and deadlines are survived.",

        quest:
            "Solve a coding challenge."

    }

};


function showLocation(name) {

    const location =
        locations[name];


    if (!location) return;


    document.getElementById(
        "locationInfo"
    ).innerHTML = `

        <span class="section-tag">
            CAMPUS LOCATION
        </span>

        <h3>
            ${location.icon}
            ${name}
        </h3>

        <p>
            ${location.description}
        </p>

        <br>

        <p>
            <strong style="color:white">
                Quest:
            </strong>
            ${location.quest}
        </p>

        <br>

        <button
            class="btn primary-btn"
            onclick="discoverLocation('${name}')"
        >
            Discover +25 XP
        </button>

    `;

}


let discoveredLocations =
    JSON.parse(
        localStorage.getItem(
            "campusQuestLocations"
        )
    ) || [];


function discoverLocation(name) {

    if (discoveredLocations.includes(name)) {

        showToast(
            "You've already discovered this location!"
        );

        return;

    }


    discoveredLocations.push(name);


    player.xp += 25;


    savePlayer();


    localStorage.setItem(
        "campusQuestLocations",
        JSON.stringify(
            discoveredLocations
        )
    );


    updatePlayerUI();


    showToast(
        "+25 XP — Location Discovered! 🗺️"
    );


    checkAchievements();

}


/* =========================================
   MEME REACTIONS
========================================= */

function reactMeme(button) {

    const span =
        button.querySelector("span");


    let count =
        parseInt(span.textContent);


    count++;


    span.textContent =
        count;


    button.style.borderColor =
        "#8b5cf6";


    showToast("Reaction added ❤️");

}


/* =========================================
   MYSTERY MODE
========================================= */

function startMystery() {

    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <div>

            <div style="
                font-size:55px;
                text-align:center;
                margin-bottom:15px;
            ">
                🔐
            </div>

            <h2>
                The Missing Trophy
            </h2>

            <p>
                The college's legendary trophy has disappeared.
                Three clues have been discovered.
            </p>

            <br>

            <p>
                <strong style="color:white">
                    CLUE #1
                </strong>
            </p>

            <p>
                "Where knowledge sleeps,
                but students rarely do."
            </p>

            <br>

            <button
                class="btn primary-btn"
                onclick="solveMystery()"
            >
                Solve Clue
            </button>

        </div>

    `;


    openModal();

}


function solveMystery() {

    player.xp += 100;


    savePlayer();

    updatePlayerUI();


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <div style="text-align:center">

            <div style="font-size:60px">
                🎉
            </div>

            <h2>
                Clue Solved!
            </h2>

            <p>
                You found the first clue.
                The trophy mystery continues...
            </p>

            <br>

            <strong style="color:#a78bfa">
                +100 XP
            </strong>

            <br><br>

            <button
                class="btn primary-btn"
                onclick="closeModal()"
            >
                Continue
            </button>

        </div>

    `;


    showToast(
        "+100 XP — Mystery Clue Solved 🔎"
    );

}


/* =========================================
   ACHIEVEMENTS
========================================= */

function checkAchievements() {

    const achievementCards =
        document.querySelectorAll(
            ".achievement"
        );


    /* Explorer */

    if (discoveredLocations.length >= 5) {

        achievementCards[2]
            .classList
            .remove("locked");

        achievementCards[2]
            .classList
            .add("unlocked");

        achievementCards[2]
            .querySelector("span")
            .textContent =
            "UNLOCKED";

    }


    /* Campus Legend */

    if (player.xp >= 500) {

        achievementCards[3]
            .classList
            .remove("locked");

        achievementCards[3]
            .classList
            .add("unlocked");

        achievementCards[3]
            .querySelector("span")
            .textContent =
            "UNLOCKED";

    }


    /* Streak Master */

    if (player.streak >= 7) {

        achievementCards[4]
            .classList
            .remove("locked");

        achievementCards[4]
            .classList
            .add("unlocked");

        achievementCards[4]
            .querySelector("span")
            .textContent =
            "UNLOCKED";

    }

}


/* =========================================
   DAILY RESET
========================================= */

function setupDailyReset() {

    const today =
        new Date().toDateString();


    const lastVisit =
        localStorage.getItem(
            "campusQuestLastVisit"
        );


    if (lastVisit !== today) {

        localStorage.setItem(
            "campusQuestLastVisit",
            today
        );


        /* Give daily streak bonus */

        if (lastVisit) {

            player.streak++;

            player.xp += 10;

        }


        /* Reset daily quest progress */

        player.completedQuests = [];


        savePlayer();

    }

}


/* =========================================
   INITIALIZE
========================================= */

setupDailyReset();

renderQuests();

updatePlayerUI();

checkAchievements();


/* =========================================
   KEYBOARD EASTER EGG
========================================= */

let keySequence = "";

const secretCode =
    "campus";


document.addEventListener(
    "keydown",
    event => {

        keySequence +=
            event.key.toLowerCase();

        keySequence =
            keySequence.slice(-secretCode.length);


        if (keySequence === secretCode) {

            player.xp += 250;

            savePlayer();

            updatePlayerUI();

            showToast(
                "🎉 SECRET EASTER EGG! +250 XP"
            );

            keySequence = "";

        }

    }
);
