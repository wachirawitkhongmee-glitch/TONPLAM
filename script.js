// --- DATA STRUCTURES ---

// 1. Problems: Defines the flow for each main problem
// Each problem has a list of 'questions' to ask and potential 'solutions' to score.
const problems = {
    traffic: {
        title: "รถติดหนักมาก",
        questions: ["distance", "urgency", "vehicle"],
        solutions: ["motorcycle_taxi", "bts_mrt", "wait_cafe", "divert_route"]
    },
    breakdown: {
        title: "รถเสียกลางทาง",
        questions: ["location_type", "mechanic_skill", "urgency"],
        solutions: ["call_mechanic", "diy_fix", "tow_truck", "ask_local"]
    },
    no_gas: {
        title: "น้ำมันหมด/ไม่พอ",
        questions: ["distance_gas", "budget"],
        solutions: ["push_car", "call_delivery", "ask_help"]
    },
    no_public_transport: {
        title: "รถสาธารณะไม่มา",
        questions: ["urgency", "budget", "time_wait"],
        solutions: ["taxi_app", "walk_connect", "change_mode"]
    },
    lost: {
        title: "หลงทาง",
        questions: ["has_internet", "landmark_visible"],
        solutions: ["open_gps", "ask_local", "call_friend"]
    },
    no_money: {
        title: "เงินไม่พอเดินทาง",
        questions: ["distance", "has_phone"],
        solutions: ["walk", "call_friend_transfer", "police_help"]
    },
    bad_weather: {
        title: "ฝนตกหนัก/อากาศแย่",
        questions: ["urgency", "vehicle_type"],
        solutions: ["wait_shelter", "drive_slow", "public_transport"]
    }
};

// 2. Questions: Definitions for each question type
const questionData = {
    distance: {
        text: "ระยะทางไกลแค่ไหน?",
        options: [
            { text: "ใกล้ๆ (< 2 กม.)", value: "short" },
            { text: "ปานกลาง (2-10 กม.)", value: "medium" },
            { text: "ไกลมาก (> 10 กม.)", value: "long" }
        ]
    },
    urgency: {
        text: "รีบแค่ไหน?",
        options: [
            { text: "ด่วนมาก! (ต้องถึงทันที)", value: "high" },
            { text: "พอมีเวลาบ้าง", value: "medium" },
            { text: "ไม่รีบ รอได้", value: "low" }
        ]
    },
    budget: {
        text: "งบประมาณที่มี?",
        options: [
            { text: "ประหยัด (น้อยกว่า 100 บาท)", value: "low" },
            { text: "พอจ่ายได้ (100-500 บาท)", value: "medium" },
            { text: "ไม่อั้น (ขอให้แก้ปัญหาได้)", value: "high" }
        ]
    },
    vehicle: {
        text: "ใช้พาหนะอะไรอยู่?",
        options: [
            { text: "รถส่วนตัว", value: "private" },
            { text: "รถสาธารณะ", value: "public" }
        ]
    },
    location_type: {
        text: "จุดที่อยู่เป็นแบบไหน?",
        options: [
            { text: "เปลี่ยว/มืด", value: "unsafe" },
            { text: "ชุมชน/ปั๊มน้ำมัน", value: "safe" },
            { text: "บนทางด่วน", value: "highway" }
        ]
    },
    mechanic_skill: {
        text: "พอซ่อมรถเบื้องต้นเป็นไหม?",
        options: [
            { text: "เป็น (พอเช็คได้)", value: "yes" },
            { text: "ไม่เป็นเลย", value: "no" }
        ]
    },
    distance_gas: {
        text: "ปั๊มที่ใกล้ที่สุด?",
        options: [
            { text: "มองเห็นได้/ไม่ไกล", value: "near" },
            { text: "ไกลมาก/ไม่รู้", value: "far" }
        ]
    },
    time_wait: {
        text: "รอมานานแค่ไหนแล้ว?",
        options: [
            { text: "เพิ่งมาถึง", value: "short" },
            { text: "นานเกิน 30 นาทีแล้ว", value: "long" }
        ]
    },
    has_internet: {
        text: "มีเน็ตไหม?",
        options: [
            { text: "มีเน็ต", value: "yes" },
            { text: "ไม่มี/แบตหมด", value: "no" }
        ]
    },
    landmark_visible: {
        text: "มองเห็นจุดเด่นอะไรไหม?",
        options: [
            { text: "ป้ายถนน/ห้าง/วัด", value: "yes" },
            { text: "ไม่เห็นอะไรเลย (ป่า/ทางเปลี่ยว)", value: "no" }
        ]
    },
    has_phone: {
        text: "มีโทรศัพท์ใช้ติดต่อไหม?",
        options: [
            { text: "มี", value: "yes" },
            { text: "ไม่มี/แบตหมด", value: "no" }
        ]
    },
    vehicle_type: {
        text: "เดินทางด้วยอะไร?",
        options: [
            { text: "มอเตอร์ไซค์", value: "bike" },
            { text: "รถยนต์", value: "car" },
            { text: "เดินเท้า", value: "walk" }
        ]
    }
};

// 3. Solutions: Details for recommendations
const solutionData = {
    motorcycle_taxi: {
        title: "เรียกวินมอเตอร์ไซค์",
        desc: "เร็วที่สุดในช่วงรถติด แต่ต้องระวังความปลอดภัย",
        cost: "50-150 บาท",
        time: "เร็ว",
        icon: "fa-motorcycle",
        action: "วินมอเตอร์ไซค์ ใกล้ฉัน"
    },
    bts_mrt: {
        title: "รถไฟฟ้า BTS/MRT",
        desc: "หนีรถติดได้แน่นอน ถ้าอยู่ใกล้สถานี",
        cost: "20-60 บาท",
        time: "ปานกลาง",
        icon: "fa-train-subway",
        action: "MRT BTS ใกล้ฉัน"
    },
    wait_cafe: {
        title: "หาที่นั่งรอ/คาเฟ่",
        desc: "ถ้ารอได้ แวะพักจนกว่าการจราจรจะดีขึ้น",
        cost: "ค่ากาแฟ",
        time: "ช้า",
        icon: "fa-mug-hot",
        action: "cafe nearby"
    },
    divert_route: {
        title: "เปลี่ยนเส้นทาง",
        desc: "ใช้ซอยลัด หรือทางด่วน (เช็ค Map ก่อน)",
        cost: "ค่าน้ำมันเพิ่ม",
        time: "ปานกลาง",
        icon: "fa-route"
    },
    call_mechanic: {
        title: "โทรเรียกช่าง/ประกัน",
        desc: "ปลอดภัยที่สุด อย่าเสี่ยงซ่อมเองถ้าไม่เป็น",
        cost: "ตามจริง/เคลม",
        time: "ช้า",
        icon: "fa-tools",
        action: "car repair nearby"
    },
    diy_fix: {
        title: "ตรวจสอบเบื้องต้นเอง",
        desc: "เช็คความร้อน, แบตเตอรี่, ยาง (เฉพาะที่ปลอดภัย)",
        cost: "ฟรี",
        time: "เร็ว",
        icon: "fa-wrench"
    },
    tow_truck: {
        title: "รถลาก/รถสไลด์",
        desc: "ถ้ารถขับต่อไม่ได้ ต้องย้ายไปอู่",
        cost: "1,500+ บาท",
        time: "ปานกลาง",
        icon: "fa-truck-pickup",
        action: "รถลาก ใกล้ฉัน"
    },
    ask_local: {
        title: "ถามคนแถวนั้น",
        desc: "ร้านค้า, วิน, หรือป้อมตำรวจ ให้ข้อมูลแม่นยำที่สุด",
        cost: "ฟรี",
        time: "เร็ว",
        icon: "fa-comments"
    },
    push_car: {
        title: "เข็นรถไปปั๊ม (ถ้าใกล้)",
        desc: "ต้องมีคนช่วยเข็น ระวังรถหลัง",
        cost: "ฟรี",
        time: "ช้า",
        icon: "fa-person-walking-dashed-line-arrow-right",
        action: "gas station nearby"
    },
    call_delivery: {
        title: "บริการส่งน้ำมันฉุกเฉิน",
        desc: "โทรหาประกันรถยนต์ หรือบริการช่วยเหลือฉุกเฉิน",
        cost: "300-500 บาท",
        time: "ปานกลาง",
        icon: "fa-oil-can"
    },
    ask_help: {
        title: "โบกรถขอความช่วยเหลือ",
        desc: "ระมัดระวังตัว เลือกขอความช่วยเหลือในที่ชุมชน",
        cost: "ฟรี",
        time: "ไม่แน่นอน",
        icon: "fa-hand-holding-heart"
    },
    taxi_app: {
        title: "เรียก Grab/Bolt",
        desc: "แพงหน่อยแต่มารับถึงที่แน่นอน",
        cost: "100-300+ บาท",
        time: "ปานกลาง",
        icon: "fa-mobile-screen"
    },
    walk_connect: {
        title: "เดินไปจุดต่อรถอื่น",
        desc: "เดินไปถนนใหญ่ หรือป้ายรถเมล์อื่น",
        cost: "ฟรี",
        time: "ช้า",
        icon: "fa-walking",
        action: "bus stop nearby"
    },
    change_mode: {
        title: "เปลี่ยนวิธีเดินทาง",
        desc: "เช่น จากรอรถเมล์ เป็นเรียกวิน/แท็กซี่หารกัน",
        cost: "ปานกลาง",
        time: "เร็ว",
        icon: "fa-shuffle"
    },
    open_gps: {
        title: "ใช้ Google Maps",
        desc: "ตั้งสติ เปิด GPS ระบุพิกัดปัจจุบัน",
        cost: "ค่าเน็ต",
        time: "เร็ว",
        icon: "fa-map-location-dot",
        action: "current location"
    },
    call_friend: {
        title: "โทรหาเพื่อน/ญาติ",
        desc: "ให้เขาช่วยเช็คทาง หรือมารับ",
        cost: "ค่าโทร",
        time: "ปานกลาง",
        icon: "fa-phone"
    },
    police_help: {
        title: "ขอความช่วยเหลือตำรวจ",
        desc: "สถานีตำรวจช่วยประสานงานได้",
        cost: "ฟรี",
        time: "ปานกลาง",
        icon: "fa-building-shield",
        action: "police station nearby"
    },
    wait_shelter: {
        title: "หาที่หลบฝน",
        desc: "ปลอดภัยไว้ก่อน รอฝนซาค่อยไปต่อ",
        cost: "ฟรี",
        time: "ช้า",
        icon: "fa-umbrella"
    },
    drive_slow: {
        title: "ขับช้าๆ เปิดไฟหน้า",
        desc: "ถ้าจำเป็นต้องไป ให้ลดความเร็วลง 50%",
        cost: "ค่าน้ำมัน",
        time: "ช้า",
        icon: "fa-car-side"
    },
    public_transport: {
        title: "จอดรถไว้ ใช้รถสาธารณะ",
        desc: "ถ้าน้ำท่วมสูง อย่าเสี่ยงขับลุย",
        cost: "ค่ารถ",
        time: "ปานกลาง",
        icon: "fa-train",
        action: "public transport nearby"
    },
    walk: {
        title: "เดินเท้า",
        desc: "ถ้าใกล้ๆ เดินไปประหยัดกว่า",
        cost: "ฟรี",
        time: "ช้า",
        icon: "fa-person-walking",
        action: "walking directions"
    },
    call_friend_transfer: {
        title: "โทรให้เพื่อนโอนเงินให้",
        desc: "ขอยืมก่อนแล้วค่อยคืน",
        cost: "ฟรี",
        time: "เร็ว",
        icon: "fa-money-bill-transfer",
        action: ""
    }
};

// --- GEOLOCATION HELPER ---
function openMap(query) {
    // 1. Check if Geolocation is supported
    if (!navigator.geolocation) {
        alert("เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง");
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
        return;
    }

    // 2. Get Current Position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Open Google Maps with current location context
            // syntax: https://www.google.com/maps/search/<query>/@<lat>,<lng>,<zoom>z
            const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},15z`;
            window.open(url, '_blank');
        },
        (error) => {
            console.error("Error getting location:", error);
            // Fallback if user denies location or error
            alert("ไม่สามารถระบุตำแหน่งได้ จะเปิดแผนที่แบบค้นหาทั่วไประครับ");
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
        }
    );
}

// --- APP STATE ---
let currentState = {
    problemId: null,
    answers: {},
    currentQuestionIndex: 0
};

// --- DOM ELEMENTS ---
const stepProblem = document.getElementById('step-problem');
const stepQuestions = document.getElementById('step-questions');
const stepResult = document.getElementById('step-result');
const stepEmergency = document.getElementById('step-emergency');
const questionText = document.getElementById('question-text');
const questionOptions = document.getElementById('question-options');
const progressBar = document.getElementById('progress');
const resultContainer = document.getElementById('result-container');

// Helper: Safe element access
function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateElementHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

// --- FUNCTIONS ---

// 1. Select Problem
function selectProblem(problemId) {
    currentState.problemId = problemId;
    currentState.answers = {};
    currentState.currentQuestionIndex = 0;

    showSection(stepQuestions);
    renderQuestion();
}

// 2. Render Current Question
function renderQuestion() {
    const problem = problems[currentState.problemId];
    const questionKey = problem.questions[currentState.currentQuestionIndex];
    const question = questionData[questionKey];

    // Update Text
    if (questionText) questionText.textContent = question.text;
    if (questionOptions) questionOptions.innerHTML = '';
    else return; // Cannot continue if options container is missing

    // Create Options
    question.options.forEach((opt, index) => {
        const btn = document.createElement('div');
        const colors = ['color-blue', 'color-green', 'color-yellow', 'color-pink', 'color-purple'];
        const colorClass = colors[index % colors.length];
        btn.className = `category-item ${colorClass}`;
        btn.style.cursor = 'pointer';
        btn.style.padding = '15px';
        btn.innerHTML = `<span>${opt.text}</span>`;
        btn.onclick = () => handleAnswer(questionKey, opt.value);
        questionOptions.appendChild(btn);
    });

    // Update Progress Bar
    const totalQuestions = problem.questions.length;
    const progressPercent = ((currentState.currentQuestionIndex) / totalQuestions) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
}

// 3. Handle Answer & Next Step
function handleAnswer(questionKey, value) {
    currentState.answers[questionKey] = value;

    const problem = problems[currentState.problemId];
    currentState.currentQuestionIndex++;

    if (currentState.currentQuestionIndex < problem.questions.length) {
        // Next Question
        renderQuestion();
    } else {
        // Finish -> Show Result
        progressBar.style.width = '100%';
        setTimeout(() => {
            analyzeAndShowResult();
        }, 300);
    }
}

// 4. Analyze Logic (The "AI" Part)
function analyzeAndShowResult() {
    const probId = currentState.problemId;
    const answers = currentState.answers;
    const potentialSolutions = problems[probId].solutions;

    // SCORING SYSTEM
    // We give each solution a score based on answers.
    let scores = potentialSolutions.map(solKey => {
        let score = 0;
        const sol = solutionData[solKey];

        // LOGIC RULES (Example)

        // 1. Urgency Rule
        if (answers.urgency === 'high') {
            if (sol.time === 'เร็ว') score += 10;
            if (sol.time === 'ช้า') score -= 5;
        }

        // 2. Budget Rule
        if (answers.budget === 'low') {
            if (sol.cost === 'ฟรี' || sol.cost.includes('10-50')) score += 10;
            if (sol.cost.includes('1,500') || sol.cost.includes('300')) score -= 10;
        }

        // 3. Distance Rule
        if (answers.distance === 'short') {
            if (solKey === 'motorcycle_taxi' || solKey === 'walk') score += 5;
        }

        // 4. Safety/Location Rule
        if (answers.location_type === 'unsafe') {
            if (solKey === 'call_mechanic' || solKey === 'call_friend') score += 15; // Priority on safety
            if (solKey === 'diy_fix') score -= 10; // Don't get out of car
        }

        return { key: solKey, score: score, details: sol };
    });

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    renderResults(scores);
    showSection(stepResult);
    showRealMap();
}

// 5. Render Results
function renderResults(scores) {
    if (!resultContainer) return;
    resultContainer.innerHTML = '';

    // Pick top 3
    const topPicks = scores.slice(0, 3);

    topPicks.forEach((item, index) => {
        const isBest = index === 0;
        const div = document.createElement('div');
        div.className = `cartoon-card ${isBest ? 'color-green' : ''}`;
        div.style.marginBottom = '20px';
        div.style.textAlign = 'left';

        div.innerHTML = `
            <h3 style="color: #FF6F61; margin-bottom: 15px;">
                ${isBest ? '🌟 แนะนำ: ' : ''} 
                ${item.details.title}
            </h3>
            <div class="result-details">
                <p><strong>ทำไม:</strong> ${item.details.desc}</p>
                <div class="tags" style="display: flex; gap: 10px; margin-top: 10px;">
                    <span class="tag" style="background: #E8F1FF; padding: 5px 10px; border-radius: 10px; font-size: 0.9rem;">
                        <i class="fa-solid fa-clock"></i> ${item.details.time}
                    </span>
                    <span class="tag" style="background: #FFF0FF; padding: 5px 10px; border-radius: 10px; font-size: 0.9rem;">
                        <i class="fa-solid fa-coins"></i> ${item.details.cost}
                    </span>
                </div>
            </div>
            ${item.details.action ?
                `<button class="cartoon-btn secondary" style="margin-top:20px; padding: 10px; font-size: 0.9rem;" onclick="openMap('${item.details.action}')">
                    📍 เปิดแผนที่ (Google Maps)
                </button>`
                : ''}
        `;
        resultContainer.appendChild(div);
    });
}

// Helper: Show Section
function showSection(section) {
    if (!section) return;
    [stepProblem, stepQuestions, stepResult, stepEmergency].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    section.classList.remove('hidden');

    // Reset Animation
    section.style.animation = 'none';
    section.offsetHeight; /* trigger reflow */
    section.style.animation = null;
}

// --- MAP INTEGRATION ---
function showRealMap() {
    const container = document.getElementById('map-container');
    const status = document.getElementById('map-status');

    if (!container || !navigator.geolocation) {
        if (status) status.textContent = "เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Generate Google Maps Embed URL
            const embedUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY_HERE&center=${lat},${lng}&zoom=15`;

            // NOTE: Since we don't have a real API key, we will use the standard search URL as an iframe src 
            // which works for public maps visualization without an API key in many cases, 
            // or better yet, use the 'place' mode with coordinates.
            const mapHtml = `<iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border:0" 
                src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed" 
                allowfullscreen>
            </iframe>`;

            container.innerHTML = mapHtml;
        },
        (error) => {
            console.error("Geolocation error:", error);
            if (status) status.textContent = "ไม่สามารถเข้าถึงตำแหน่งได้ (โปรดอนุญาตสิทธิ์)";
        }
    );
}

// Restart
function restartApp() {
    currentState = { problemId: null, answers: {}, currentQuestionIndex: 0 };
    showSection(stepProblem);
}

// Emergency
function showEmergency() {
    showSection(stepEmergency);
}
function hideEmergency() {
    showSection(stepResult); // Go back to result usually
}
