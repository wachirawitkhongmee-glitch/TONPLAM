// Minigames Logic

function showMenu() {
    document.querySelectorAll('.game-container').forEach(el => el.classList.remove('active'));
    document.getElementById('gameMenu').style.display = 'block';
    clearMessages();
}

function clearMessages() {
    document.querySelectorAll('.status-msg').forEach(el => {
        el.innerText = '';
        el.style.color = '#ff6f61';
    });
}

function showMessage(gameId, text, isSuccess = false) {
    let el = document.getElementById(`msg${gameId}`);
    el.innerText = text;
    el.style.color = isSuccess ? '#4caf50' : '#ff6f61';
    if (!isSuccess) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    }
}

function startGame(id) {
    document.getElementById('gameMenu').style.display = 'none';
    document.querySelectorAll('.game-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`game${id}`).classList.add('active');
    clearMessages();

    if (id === 1) initCardGame('easy'); // Default
    if (id === 2) {
        document.getElementById('simonScore').innerText = '0';
        showMessage(2, "กด Start เพื่อเริ่มเกม!");
    }
    if (id === 3) new24Game();
}

// --- Game 1: Card Match ---
let cardGrid = document.getElementById('cardBoard');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let isLocked = false;

const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🥑', '🌽'];

function initCardGame(difficulty) {
    cardGrid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    isLocked = false;
    showMessage(1, "");

    let rows, cols;
    if (difficulty === 'easy') { rows = 4; cols = 3; } // 12 cards (6 pairs)
    else if (difficulty === 'normal') { rows = 4; cols = 4; } // 16 cards (8 pairs)
    else { rows = 5; cols = 4; } // 20 cards (10 pairs)

    totalPairs = (rows * cols) / 2;
    cardGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Generate pairs
    let gameEmojis = emojis.slice(0, totalPairs);
    let deck = [...gameEmojis, ...gameEmojis];
    deck.sort(() => 0.5 - Math.random());

    deck.forEach(symbol => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        // card.innerHTML = ... ; // Don't reveal content yet
        card.innerText = ""; // Ensure it's empty
        card.onclick = () => flipCard(card);
        cardGrid.appendChild(card);
    });
}

function flipCard(card) {
    if (isLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.innerText = card.dataset.symbol; // Show symbol on flip
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true;
    let [c1, c2] = flippedCards;

    if (c1.dataset.symbol === c2.dataset.symbol) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        isLocked = false;

        if (matchedPairs === totalPairs) {
            showMessage(1, "🎉 ยินดีด้วย! คุณชนะแล้ว!", true);
        }
    } else {
        // Reduced wait time from 1000ms to 700ms for snappier feel
        setTimeout(() => {
            c1.classList.remove('flipped');
            c1.innerText = "";
            c2.classList.remove('flipped');
            c2.innerText = "";
            flippedCards = [];
            isLocked = false;
        }, 700);
    }
}

// --- Game 2: Memory Simon ---
let simonSequence = [];
let playerSequence = [];
let simonLevel = 0;
let isSimonPlaying = false;

function startSimonGame() {
    simonSequence = [];
    playerSequence = [];
    simonLevel = 0;
    document.getElementById('simonScore').innerText = '0';
    showMessage(2, "จำลำดับให้ดี...", true);
    nextSimonRound();
}

function nextSimonRound() {
    simonLevel++;
    playerSequence = [];
    document.getElementById('simonScore').innerText = simonLevel - 1;

    // Add random step (0-3)
    simonSequence.push(Math.floor(Math.random() * 4));

    setTimeout(playSimonSequence, 600);
}

function playSimonSequence() {
    isSimonPlaying = true;
    let i = 0;
    // Faster sequence: 600ms per beat
    let interval = setInterval(() => {
        if (i >= simonSequence.length) {
            clearInterval(interval);
            isSimonPlaying = false;
            showMessage(2, "ตาคุณแล้ว!", true);
            return;
        }
        flashSimonBtn(simonSequence[i]);
        i++;
    }, 600);
}

function flashSimonBtn(index) {
    let btn = document.getElementById(`simon${index}`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 300);
}

function handleSimonInput(index) {
    if (isSimonPlaying) return;
    if (simonSequence.length === 0) return; // Game not started

    flashSimonBtn(index);
    playerSequence.push(index);

    // Check correctness
    let currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== simonSequence[currentStep]) {
        showMessage(2, `❌ ผิดพลาด! คะแนนจบที่: ${simonLevel - 1}`);
        simonSequence = []; // Reset
        return;
    }

    if (playerSequence.length === simonSequence.length) {
        showMessage(2, "ถูกต้อง! ไปต่อ...", true);
        setTimeout(nextSimonRound, 800);
    }
}

// --- Game 3: 24 Game ---
let nums24 = [];
let currentExpr = "";

function new24Game() {
    nums24 = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
    currentExpr = "";
    showMessage(3, "เลือกเลขและเครื่องหมาย", true);
    render24();
}

function render24() {
    let container = document.getElementById('nums24');
    container.innerHTML = "";
    document.getElementById('calcDisplay').innerText = currentExpr;

    nums24.forEach((n, idx) => {
        let card = document.createElement('div');
        card.className = 'num-card';
        card.innerText = n;
        card.onclick = () => addToExpr(n);
        container.appendChild(card);
    });
}

function addToExpr(val) {
    currentExpr += val;
    document.getElementById('calcDisplay').innerText = currentExpr;
}

function selectOp(op) {
    currentExpr += ` ${op} `; // Add spaces for readability
    document.getElementById('calcDisplay').innerText = currentExpr;
}

function clear24() {
    currentExpr = "";
    document.getElementById('calcDisplay').innerText = "";
    showMessage(3, "");
}

function check24() {
    try {
        // Safety check: only allow numbers and operators
        if (/[^0-9+\-*/().\s]/.test(currentExpr)) {
            showMessage(3, "สมการไม่ถูกต้อง");
            return;
        }

        // Evaluate
        let result = eval(currentExpr);

        if (Math.abs(result - 24) < 0.0001) {
            showMessage(3, "🎉 ถูกต้อง! เก่งมาก!", true);
            setTimeout(new24Game, 1500); // Auto next round
        } else {
            showMessage(3, `คำตอบคือ ${result} (ยังไม่ใช่ 24)`);
        }
    } catch (e) {
        showMessage(3, "รูปแบบสมการผิดพลาด");
    }
}
