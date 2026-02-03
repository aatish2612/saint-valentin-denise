/* --- CONFIGURATION --- */
const questions = [
    {
        q: "Quelle est ma couleur préférée ?",
        a1: "Bleu",
        a2: "Rouge",
        correct: 1 // Bleu
    },
    {
        q: "Où s'est-on rencontré (ou parlé) la 1ère fois ?",
        a1: "Snapchat",
        a2: "TikTok",
        correct: 2 // TikTok
    },
    {
        q: "Quand est-ce qu'on c'est mis en couple ?",
        a1: "16 Aout 2025",
        a2: "27 Avril 2025",
        correct: 1 // Date
    },
    {
        q: "Qui est le plus drôle du couple ?",
        a1: "C'est toi Denise",
        a2: "C'est MOI évidemment",
        correct: 2 // Toi
    }
];

// --- LOGIQUE GÉNÉRALE ---
let currentScreen = 0;
const screens = ['screen-intro', 'screen-quiz', 'screen-catch', 'screen-memory', 'screen-spam', 'screen-final'];

function startGame() {
    nextScreen();
}

function nextScreen() {
    const currentEl = document.getElementById(screens[currentScreen]);
    if(currentEl) {
        currentEl.classList.remove('active-screen');
        currentEl.classList.add('hidden-screen');
    }
    
    currentScreen++;
    
    if (currentScreen < screens.length) {
        const nextEl = document.getElementById(screens[currentScreen]);
        nextEl.classList.remove('hidden-screen');
        nextEl.classList.add('active-screen');
        initLevel(currentScreen);
    }
}

function initLevel(levelIndex) {
    if (levelIndex === 1) startQuiz();
    if (levelIndex === 2) startCatchGame();
    if (levelIndex === 3) startMemoryGame();
    if (levelIndex === 4) startSpamGame();
    if (levelIndex === 5) initScratchCard();
}

/* --- NIVEAU 1 : QUIZ --- */
let qIndex = 0;
function startQuiz() {
    qIndex = 0;
    showQuestion();
}

function showQuestion() {
    if (qIndex >= questions.length) {
        alert("Bravo ! Passons à la suite erumai maadu.");
        nextScreen();
        return;
    }
    const q = questions[qIndex];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('btn-rep1').innerText = q.a1;
    document.getElementById('btn-rep2').innerText = q.a2;
}

function checkAnswer(choice) {
    if (choice === questions[qIndex].correct) {
        qIndex++;
        showQuestion();
    } else {
        alert("FAUX ! Essaye encore sal PANNI... 😱");
    }
}

/* --- NIVEAU 2 : CATCH --- */
let scoreCatch = 0;
let catchInterval; 

function startCatchGame() {
    scoreCatch = 0;
    document.getElementById('score-catch').innerText = scoreCatch;
    const gameArea = document.getElementById('game-area-catch');
    gameArea.innerHTML = ''; 

    catchInterval = setInterval(() => {
        if (scoreCatch >= 10) {
            clearInterval(catchInterval);
            gameArea.innerHTML = ''; 
            alert("Tu as des réflexes de ninja naiye !");
            nextScreen();
            return;
        }
        
        const heart = document.createElement('div');
        heart.innerText = "❤️";
        heart.classList.add('falling-heart');
        heart.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
        heart.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
        
        const catchHeart = function() {
            scoreCatch++;
            document.getElementById('score-catch').innerText = scoreCatch;
            heart.remove();
        };
        heart.addEventListener('touchstart', catchHeart);
        heart.addEventListener('click', catchHeart); // Click souris aussi
        
        gameArea.appendChild(heart);
        setTimeout(() => { if(heart.parentNode) heart.remove(); }, 1200);
    }, 700);
}

/* --- NIVEAU 3 : MEMORY --- */
const emojisBase = ["👀", "🍔", "💋", "🌹", "🐷", "🍕"]; 
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function startMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    
    cards = [...emojisBase, ...emojisBase];
    cards.sort(() => 0.5 - Math.random());
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.innerText = card.dataset.emoji;
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 600);
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === emojisBase.length) {
            alert("Mémoire de MARAMANDAI mais thapichitte 🙄 !");
            nextScreen();
        }
    } else {
        c1.classList.remove('flipped');
        c1.innerText = '';
        c2.classList.remove('flipped');
        c2.innerText = '';
        flippedCards = [];
    }
}

/* --- NIVEAU 4 : SPAM --- */
let loveLevel = 0;
let spamInterval;
let isGameWon = false;

function startSpamGame() {
    loveLevel = 0;
    isGameWon = false;
    updateBar();
    
    spamInterval = setInterval(() => {
        if (!isGameWon && loveLevel > 0) {
            loveLevel -= 2; 
            if (loveLevel < 0) loveLevel = 0;
            updateBar();
        }
    }, 100);
}

function spamLove() {
    if (isGameWon) return;
    loveLevel += 8; 
    if (loveLevel >= 100) {
        loveLevel = 100;
        updateBar();
        winSpamGame();
    } else {
        updateBar();
    }
}

function updateBar() {
    document.getElementById('love-bar').style.width = loveLevel + '%';
}

function winSpamGame() {
    isGameWon = true;
    clearInterval(spamInterval); 
    setTimeout(() => {
        alert("L'AMOUR A GAGNÉ DENISE UHHHH !!! ❤️❤️❤️");
        nextScreen(); 
    }, 300);
}

/* --- FINAL : SCRATCH CARD --- */
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const hiddenContent = document.getElementById('hidden-content');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = '#d4af37'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texte
    ctx.font = "bold 24px Montserrat";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("GRATTE POUR DÉCOUVRIR ✨", canvas.width/2, canvas.height/2);
    
    let isDrawing = false;
    let scratchCount = 0; 
    let revealed = false;

    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.fill();
        scratchCount++;
        checkReveal();
    }

    function checkReveal() {
        if (scratchCount > 60 && !revealed) {
            reveal();
        }
    }
    
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const t = e.touches[0];
        scratch(t.clientX, t.clientY);
    }, {passive: false});
    
    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            e.preventDefault();
            const t = e.touches[0];
            scratch(t.clientX, t.clientY);
        }
    }, {passive: false});
    
    canvas.addEventListener('touchend', () => isDrawing = false);
    
    canvas.addEventListener('mousedown', (e) => { isDrawing=true; scratch(e.clientX, e.clientY); });
    canvas.addEventListener('mousemove', (e) => { if(isDrawing) scratch(e.clientX, e.clientY); });
    canvas.addEventListener('mouseup', () => isDrawing=false);

    // --- La Révélation ---
    function reveal() {
        revealed = true;
        
        canvas.style.transition = 'opacity 0.8s';
        canvas.style.opacity = '0';
        
        hiddenContent.classList.add('fade-in');

        // IMPORTANT : Force le body a scroller au cas ou
        document.body.style.overflow = 'auto'; 
        
        setTimeout(() => {
            canvas.remove(); // Enlève le grattage
            if (typeof confetti === 'function') {
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            }
        }, 800);
    }
}