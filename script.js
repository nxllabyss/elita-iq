/*
  IQ Labyrinth — script.js (TO'G'RILANGAN)
  Dark Red / INTJ logic for the step-by-step quiz.
  - Expects questions.js to provide: easyQuestions, mediumQuestions, hardQuestions as window globals
  - Works with index.html DOM (single DOM, update by classes/text)
  - Saves nickname to localStorage, supports i18n (en / uz / ru)
*/

/* =======================
   Utility / State
   ======================= */
const APP = {
  state: {
    step: 1,
    nickname: "",
    lang: "en",
    difficulty: "easy",
    timerSec: 0, // 0 = none
    questionCount: 10, // number or 'endless'
    questions: [], // current question pool
    currentIndex: 0,
    answeredCount: 0,
    correctCount: 0,
    timer: null,
    timerRemaining: 0,
    isEndless: false,
    isAnswered: false,
  },

  // i18n dictionary (keys correspond to data-i18n attributes used in index.html)
  i18n: {
    en: {
      brand: "IQ Labyrinth",
      tagline: "Minimal. Focused. Smart.",
      mode: "INTJ Mode",
      step1_title: "Welcome, strategist",
      step1_sub: "Enter a nickname to begin.",
      nickname_label: "Nickname",
      next: "Next",
      back: "Back",
      step2_title: "Choose language",
      step2_sub: "All UI will adapt to your choice.",
      step3_title: "Choose difficulty",
      step3_sub: "Easy / Medium / Hard — intelligence, measured.",
      step4_title: "Timer",
      step4_sub: "No timer or choose a challenge pace.",
      timer_none: "No timer",
      step5_title: "How many questions?",
      step5_sub: "Pick a testing length or go Endless.",
      endless: "Endless",
      endless_info:
        "Endless mode: questions continue until you stop — perfect for practice.",
      start: "Start Test",
      player_meta: "Ready",
      skip: "Skip",
      next_q: "Next",
      results_title: "Results",
      iq_label: "IQ Score",
      retry: "Retry",
      share: "Share",
      footer: "Built for focus — INTJ aesthetic.",
      noscript:
        "JavaScript is required for IQ Labyrinth to function. Please enable JavaScript.",
      motivate_1: "Tiny focus. Big clarity.",
      motivate_2: "Language shapes thought — pick one.",
      motivate_3: "Challenge chosen — optimize your approach.",
      motivate_4: "Time is a constraint — use it or not.",
      motivate_5: "Consistency beats speed. Keep steady.",
      motivate_result: "You optimized. Well done.",
    },
    uz: {
      brand: "IQ Labyrinth",
      tagline: "Minimal. Fokuslangan. Aqlli.",
      mode: "INTJ Rejim",
      step1_title: "Xush kelibsiz, strateg",
      step1_sub: "Boshlash uchun nickname kiriting.",
      nickname_label: "Nickname",
      next: "Keyingi",
      back: "Orqaga",
      step2_title: "Tilni tanlang",
      step2_sub: "Barcha interfeys tanlangan tilga moslashadi.",
      step3_title: "Qiyinchilikni tanlang",
      step3_sub: "Oson / O'rtacha / Qiyin — aqlingizni sinang.",
      step4_title: "Vaqt",
      step4_sub: "Taymerni ishlatmaslik yoki sinov tezligini tanlash.",
      timer_none: "Taymer yo'q",
      step5_title: "Necha savol?",
      step5_sub: "Sinov uzunligini tanlang yoki Endless rejimga o'ting.",
      endless: "Cheksiz",
      endless_info:
        "Endless rejim: savollar to'xtamaguncha davom etadi — mashq uchun ideal.",
      start: "Testni boshlash",
      player_meta: "Tayyor",
      skip: "O'tkazish",
      next_q: "Keyingi",
      results_title: "Natijalar",
      iq_label: "IQ Ball",
      retry: "Qayta urinib ko'rish",
      share: "Ulashish",
      footer: "Diqqat uchun yaratilgan — INTJ estetika.",
      noscript:
        "IQ Labyrinth ishlashi uchun JavaScript kerak. Iltimos, JavaScriptni yoqing.",
      motivate_1: "Kichik fokus. Katta aniqlik.",
      motivate_2: "Til fikrni shakllantiradi — birini tanlang.",
      motivate_3: "Qiyinchilik tanlandi — uslubingizni optimallashtiring.",
      motivate_4: "Vaqt cheklov — foydalaning yoki yo'q.",
      motivate_5: "Tizimlilik tezlikdan ustun. Barqaror bo'ling.",
      motivate_result: "Siz optimallashtirdingiz. Zo'r natija.",
    },
    ru: {
      brand: "IQ Labyrinth",
      tagline: "Минималистично. Сфокусировано. Умно.",
      mode: "Режим INTJ",
      step1_title: "Добро пожаловать, стратег",
      step1_sub: "Введите никнейм для начала.",
      nickname_label: "Никнейм",
      next: "Далее",
      back: "Назад",
      step2_title: "Выберите язык",
      step2_sub: "Весь интерфейс адаптируется под выбор.",
      step3_title: "Выберите сложность",
      step3_sub: "Легко / Средне / Сложно — проверьте интеллект.",
      step4_title: "Таймер",
      step4_sub: "Без таймера или выберите темп.",
      timer_none: "Без таймера",
      step5_title: "Сколько вопросов?",
      step5_sub: "Выберите длину теста или Endless.",
      endless: "Бесконечно",
      endless_info:
        "Endless режим: вопросы до тех пор, пока вы не остановитесь — отлично для практики.",
      start: "Начать тест",
      player_meta: "Готов",
      skip: "Пропустить",
      next_q: "Далее",
      results_title: "Результаты",
      iq_label: "IQ Оценка",
      retry: "Повторить",
      share: "Поделиться",
      footer: "Сделано для фокуса — эстетика INTJ.",
      noscript:
        "Для работы IQ Labyrinth требуется JavaScript. Пожалуйста, включите JavaScript.",
      motivate_1: "Маленький фокус. Большая ясность.",
      motivate_2: "Язык формирует мысль — выберите один.",
      motivate_3: "Вызов выбран — оптимизируйте подход.",
      motivate_4: "Время — ограничение. Используйте или нет.",
      motivate_5: "Постоянство лучше скорости. Держитесь.",
      motivate_result: "Вы оптимизировали. Отличная работа.",
    },
  },
};

/* =======================
   DOM Queries (cached)
   ======================= */
const DOM = {
  app: document.getElementById("app"),
  steps: [...document.querySelectorAll(".step")],
  nicknameInput: document.getElementById("nickname"),
  playerNickname: document.getElementById("player-nickname"),
  playerMeta: document.getElementById("player-meta"),
  btnNextAll: [...document.querySelectorAll(".btn-next, .btn-start")],
  optionBtns: [...document.querySelectorAll(".option-btn")],
  answers: [...document.querySelectorAll(".answer-btn")],
  questionText: document.getElementById("question-text"),
  progressBar: document.getElementById("progress-bar"),
  progressCount: document.getElementById("progress-count"),
  progressPercent: document.getElementById("progress-percent"),
  timerEl: document.getElementById("timer"),
  testControls: document.querySelector(".test-controls"),
  btnSkip: document.querySelector(".btn-skip"),
  btnNextQuestion: document.querySelector(".btn-next-question"),
  resultsIQ: document.getElementById("iq-score"),
  resultsSummary: document.getElementById("results-summary"),
  btnRetry: document.querySelector(".btn-retry"),
  btnShare: document.querySelector(".btn-share"),
  // i18n elements (any element with data-i18n attribute)
  i18nNodes: [...document.querySelectorAll("[data-i18n]")],
};

/* =======================
   Helper functions
   ======================= */
function _(key) {
  const lang = APP.state.lang || "en";
  return (APP.i18n[lang] && APP.i18n[lang][key]) || APP.i18n["en"][key] || key;
}

function shuffle(arr) {
  // Fisher-Yates
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeParseInt(val, fallback = 0) {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
}

function formatTime(sec) {
  if (!sec || sec <= 0) return "00:00";
  const mm = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const ss = (sec % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

/* =======================
   Primary functions (entry points)
   ======================= */
function startApp() {
  console.log("App started");

  // Load nickname from localStorage
  const stored = localStorage.getItem("iq_lab_nickname");
  if (stored) {
    APP.state.nickname = stored;
    if (DOM.nicknameInput) DOM.nicknameInput.value = stored;
    if (DOM.playerNickname) DOM.playerNickname.textContent = stored;
  }

  // Initialize i18n (render any static texts)
  applyI18n();

  // Attach event listeners for UI interactions
  attachUI();

  // Ensure correct initial step visible
  showStep(1);
}

function saveNickname(nick) {
  APP.state.nickname = (nick || "").trim().slice(0, 24);
  if (APP.state.nickname) {
    localStorage.setItem("iq_lab_nickname", APP.state.nickname);
    if (DOM.playerNickname) DOM.playerNickname.textContent = APP.state.nickname;
  }
}

function selectLanguage(lang) {
  if (!["en", "uz", "ru"].includes(lang)) return;
  APP.state.lang = lang;
  // update UI texts
  applyI18n();
}

function selectDifficulty(diff) {
  if (!["easy", "medium", "hard"].includes(diff)) return;
  APP.state.difficulty = diff;
}

function selectTimer(timerVal) {
  // timerVal can be 'none' or number as string
  if (timerVal === "none" || timerVal === "0") {
    APP.state.timerSec = 0;
  } else {
    APP.state.timerSec = Math.max(0, safeParseInt(timerVal, 0));
  }
}

function selectQuestionCount(countVal) {
  if (countVal === "endless") {
    APP.state.isEndless = true;
    APP.state.questionCount = "endless";
  } else {
    APP.state.isEndless = false;
    APP.state.questionCount = Math.max(1, safeParseInt(countVal, 10));
  }
}

/* =======================
   Quiz lifecycle
   ======================= */
function startTest() {
  console.log("Starting test...");

  // Prepare questions pool based on difficulty
  const diff = APP.state.difficulty || "easy";
  let pool = [];

  // Check if questions are available as window globals
  if (diff === "easy" && window.easyQuestions)
    pool = window.easyQuestions.slice();
  else if (diff === "medium" && window.mediumQuestions)
    pool = window.mediumQuestions.slice();
  else if (diff === "hard" && window.hardQuestions)
    pool = window.hardQuestions.slice();

  // Fallback: if pool empty, combine any available arrays
  if (!pool || pool.length === 0) {
    pool = [];
    if (window.easyQuestions) pool = pool.concat(window.easyQuestions);
    if (window.mediumQuestions) pool = pool.concat(window.mediumQuestions);
    if (window.hardQuestions) pool = pool.concat(window.hardQuestions);
  }

  console.log("Questions loaded:", pool.length);

  // Shuffle pool & choose count
  pool = shuffle(pool || []);

  if (APP.state.isEndless) {
    APP.state.questions = pool.length ? pool : generatePlaceholderQuestions();
  } else {
    const required = APP.state.questionCount || 10;
    if (pool.length >= required) {
      APP.state.questions = pool.slice(0, required);
    } else {
      const result = [];
      while (result.length < required) {
        result.push(...shuffle(pool));
        if (pool.length === 0) break;
      }
      APP.state.questions = result.slice(0, required);
    }
  }

  console.log("Selected questions:", APP.state.questions.length);

  // Reset stats
  APP.state.currentIndex = 0;
  APP.state.answeredCount = 0;
  APP.state.correctCount = 0;
  APP.state.isAnswered = false;

  // Update player UI
  if (DOM.playerNickname)
    DOM.playerNickname.textContent = APP.state.nickname || "—";
  if (DOM.playerMeta) DOM.playerMeta.textContent = _("player_meta");

  // Render first question
  showQuestion();
}

function showQuestion() {
  console.log("Showing question", APP.state.currentIndex);

  // Clear timer if any
  stopTimer();

  // Check if we've reached the end
  if (
    !APP.state.isEndless &&
    APP.state.currentIndex >= APP.state.questions.length
  ) {
    console.log("End of questions, showing results");
    showResult();
    return;
  }

  // Get question data
  let qData;
  if (APP.state.isEndless) {
    const pool = APP.state.questions;
    if (!pool || pool.length === 0) {
      qData = generatePlaceholderQuestions(1)[0];
    } else {
      qData = pool[Math.floor(Math.random() * pool.length)];
    }
  } else {
    qData = APP.state.questions[APP.state.currentIndex];
  }

  if (!qData) {
    console.log("No question data, showing results");
    showResult();
    return;
  }

  // Fill question text & answers
  if (DOM.questionText) DOM.questionText.textContent = qData.question || "—";

  const answers = qData.answers || [];
  DOM.answers.forEach((btn, idx) => {
    const txt = answers[idx] !== undefined ? answers[idx] : "";
    btn.textContent = txt;
    btn.dataset.correct = qData.correct === idx ? "true" : "false";
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
    btn.setAttribute("aria-pressed", "false");
  });

  // Reset controls visibility
  hideNextQuestionBtn();

  // Update progress
  updateProgress();

  APP.state.isAnswered = false;

  // Start timer if defined
  if (APP.state.timerSec && APP.state.timerSec > 0) {
    startTimer(APP.state.timerSec);
  } else {
    if (DOM.timerEl) {
      DOM.timerEl.textContent = formatTime(0);
      DOM.timerEl.classList.remove("counting");
    }
  }
}

function checkAnswer(selectedBtn) {
  if (APP.state.isAnswered) return;
  APP.state.isAnswered = true;

  // Stop timer if running
  stopTimer();

  // Mark buttons
  DOM.answers.forEach((btn) => {
    btn.disabled = true;
    const isCorrect = btn.dataset.correct === "true";
    if (isCorrect) {
      btn.classList.add("correct");
    }
    if (btn === selectedBtn && btn.dataset.correct !== "true") {
      btn.classList.add("wrong");
    }
  });

  // Stats
  APP.state.answeredCount++;
  const selectedCorrect = selectedBtn && selectedBtn.dataset.correct === "true";
  if (selectedCorrect) APP.state.correctCount++;

  // Update progress
  updateProgress();

  // Show next question button
  showNextQuestionBtn();
}

function nextQuestion() {
  console.log("Next question");

  if (APP.state.isEndless) {
    APP.state.currentIndex++;
    showQuestion();
    return;
  }

  if (APP.state.currentIndex + 1 < APP.state.questions.length) {
    APP.state.currentIndex++;
    showQuestion();
  } else {
    console.log("Test finished");
    showResult();
  }
}

/* Timer functions */
function startTimer(seconds) {
  stopTimer();
  APP.state.timerRemaining = seconds;
  updateTimerDisplay();
  if (DOM.timerEl) DOM.timerEl.classList.add("counting");

  APP.state.timer = setInterval(() => {
    APP.state.timerRemaining--;
    if (APP.state.timerRemaining < 0) {
      stopTimer();
      handleTimeUp();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (APP.state.timer) {
    clearInterval(APP.state.timer);
    APP.state.timer = null;
  }
  if (DOM.timerEl) DOM.timerEl.classList.remove("counting");
}

function updateTimerDisplay() {
  if (!DOM.timerEl) return;
  DOM.timerEl.textContent = formatTime(APP.state.timerRemaining);
}

function handleTimeUp() {
  if (APP.state.isAnswered) return;

  APP.state.isAnswered = true;

  DOM.answers.forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
    btn.disabled = true;
  });

  APP.state.answeredCount++;
  updateProgress();
  showNextQuestionBtn();
}

/* Progress & UI update */
function updateProgress() {
  const total = APP.state.isEndless
    ? APP.state.questionCount === "endless"
      ? "∞"
      : APP.state.questionCount
    : APP.state.questions.length;
  const answered = APP.state.answeredCount;
  const percent = APP.state.isEndless
    ? null
    : Math.round((answered / (APP.state.questions.length || 1)) * 100);

  if (DOM.progressCount) {
    DOM.progressCount.textContent = `${answered}/${total}`;
  }
  if (DOM.progressPercent) {
    DOM.progressPercent.textContent = percent === null ? "—" : `${percent}%`;
  }
  if (DOM.progressBar) {
    const width = percent === null ? 0 : percent;
    DOM.progressBar.style.width = `${width}%`;
    DOM.progressBar.setAttribute("aria-valuenow", percent === null ? 0 : width);
  }
}

function showResult() {
  console.log("Showing results");

  stopTimer();

  const correct = APP.state.correctCount;
  const total = APP.state.isEndless
    ? APP.state.answeredCount
    : APP.state.questions.length || 1;
  const ratio = total ? correct / total : 0;

  const baseByDifficulty = { easy: 90, medium: 100, hard: 110 };
  const base = baseByDifficulty[APP.state.difficulty] || 100;
  const estimatedIQ = Math.round(base + (ratio - 0.5) * 40);
  const clampedIQ = Math.max(60, Math.min(160, estimatedIQ));

  if (DOM.resultsIQ) DOM.resultsIQ.textContent = `${clampedIQ}`;
  if (DOM.resultsSummary) {
    DOM.resultsSummary.textContent = `Correct: ${correct}/${total} — ${Math.round(ratio * 100)}% (IQ: ${clampedIQ})`;
  }

  showStep(7);
}

function restartQuiz() {
  APP.state.timer = null;
  APP.state.currentIndex = 0;
  APP.state.answeredCount = 0;
  APP.state.correctCount = 0;
  APP.state.isAnswered = false;
  APP.state.questions = [];
  APP.state.isEndless = false;
  APP.state.questionCount = 10;
  APP.state.timerSec = 0;
  APP.state.difficulty = "easy";

  if (DOM.nicknameInput) DOM.nicknameInput.value = APP.state.nickname || "";

  DOM.optionBtns.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });

  showStep(1);
}

function shareResults() {
  const text = `IQ Labyrinth result: ${DOM.resultsIQ.textContent} IQ`;
  if (navigator.share) {
    navigator
      .share({
        title: "IQ Labyrinth Result",
        text: text,
      })
      .catch(console.error);
  } else {
    alert(text);
  }
}

/* =======================
   UI helpers & wiring
   ======================= */
function attachUI() {
  // Nickname input
  if (DOM.nicknameInput) {
    DOM.nicknameInput.addEventListener("input", (e) => {
      const v = e.target.value;
      enableNextInStep(1, v.trim().length > 0);
      saveNickname(v);
    });

    // Check initial value
    if (DOM.nicknameInput.value && DOM.nicknameInput.value.trim().length > 0) {
      enableNextInStep(1, true);
    }
  }

  // Navigation buttons
  document.addEventListener("click", (e) => {
    const nextBtn = e.target.closest(".btn-next, .btn-start");
    if (nextBtn && nextBtn.dataset && nextBtn.dataset.stepTarget) {
      e.preventDefault();
      const target = Number(nextBtn.dataset.stepTarget);

      if (target === 6) {
        showStep(target);
        setTimeout(() => startTest(), 120);
      } else {
        showStep(target);
      }
      return;
    }

    const prevBtn = e.target.closest(".btn-prev");
    if (prevBtn && prevBtn.dataset && prevBtn.dataset.stepTarget) {
      e.preventDefault();
      showStep(Number(prevBtn.dataset.stepTarget));
      return;
    }

    if (e.target.closest(".btn-share")) {
      shareResults();
    }
  });

  // Option buttons
  DOM.optionBtns.forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      const b = ev.currentTarget;
      const group = b.parentElement;

      if (group) {
        [...group.children].forEach((ch) => {
          ch.classList.remove("active");
          ch.setAttribute("aria-pressed", "false");
        });
      }

      b.classList.add("active");
      b.setAttribute("aria-pressed", "true");

      if (b.dataset.lang) selectLanguage(b.dataset.lang);
      if (b.dataset.difficulty) selectDifficulty(b.dataset.difficulty);
      if (b.dataset.timer) selectTimer(b.dataset.timer);
      if (b.dataset.count) selectQuestionCount(b.dataset.count);

      const stepEl = b.closest(".step");
      if (stepEl && stepEl.dataset && stepEl.dataset.step) {
        enableNextInStep(Number(stepEl.dataset.step), true);
      }
    });
  });

  // Answer buttons
  DOM.answers.forEach((btn, idx) => {
    btn.setAttribute("data-answer-index", String(idx));
    btn.addEventListener("click", (ev) => {
      checkAnswer(ev.currentTarget);
    });
  });

  // Test controls
  if (DOM.btnSkip) {
    DOM.btnSkip.addEventListener("click", () => {
      if (!APP.state.isAnswered) {
        handleTimeUp();
      }
    });
  }

  if (DOM.btnNextQuestion) {
    DOM.btnNextQuestion.addEventListener("click", () => {
      nextQuestion();
    });
  }

  // Retry button
  if (DOM.btnRetry) {
    DOM.btnRetry.addEventListener("click", () => {
      restartQuiz();
    });
  }
}

function enableNextInStep(stepNumber, enable = true) {
  const stepEl = document.querySelector(`.step[data-step="${stepNumber}"]`);
  if (!stepEl) return;

  const nextBtn = stepEl.querySelector(".btn-next, .btn-start");
  if (!nextBtn) return;

  if (enable) {
    nextBtn.removeAttribute("aria-disabled");
    setTimeout(() => nextBtn.classList.add("visible"), 10);
  } else {
    nextBtn.setAttribute("aria-disabled", "true");
    nextBtn.classList.remove("visible");
  }
}

function showStep(stepNumber) {
  console.log("Showing step:", stepNumber);

  APP.state.step = Number(stepNumber);

  DOM.steps.forEach((s) => {
    const num = Number(s.dataset.step);
    if (num === APP.state.step) {
      s.classList.add("step--active");
      s.setAttribute("aria-hidden", "false");

      const nextBtn = s.querySelector(".btn-next, .btn-start");
      if (nextBtn) {
        const disabled = nextBtn.getAttribute("aria-disabled") === "true";
        if (!disabled) {
          nextBtn.classList.add("visible");
        }
      }

      if (num === 6) {
        if (DOM.playerNickname)
          DOM.playerNickname.textContent = APP.state.nickname || "—";
        if (DOM.playerMeta) DOM.playerMeta.textContent = _("player_meta");
      }
    } else {
      s.classList.remove("step--active");
      s.setAttribute("aria-hidden", "true");

      const nextB = s.querySelector(".btn-next, .btn-start");
      if (nextB) nextB.classList.remove("visible");
    }
  });

  // Enable next buttons for steps with selections
  if (APP.state.step === 2) {
    const selected = document.querySelector(
      ".options--lang .option-btn.active",
    );
    enableNextInStep(2, !!selected);
  }
  if (APP.state.step === 3) {
    const selected = document.querySelector(
      ".options--difficulty .option-btn.active",
    );
    enableNextInStep(3, !!selected);
  }
  if (APP.state.step === 4) {
    const selected = document.querySelector(
      ".options--timer .option-btn.active",
    );
    enableNextInStep(4, !!selected);
  }
  if (APP.state.step === 5) {
    const selected = document.querySelector(
      ".options--count .option-btn.active",
    );
    enableNextInStep(5, !!selected);
  }
}

function showNextQuestionBtn() {
  if (!DOM.btnNextQuestion) return;
  DOM.btnNextQuestion.removeAttribute("aria-disabled");
  DOM.btnNextQuestion.classList.add("visible");
}

function hideNextQuestionBtn() {
  if (!DOM.btnNextQuestion) return;
  DOM.btnNextQuestion.setAttribute("aria-disabled", "true");
  DOM.btnNextQuestion.classList.remove("visible");
}

function applyI18n() {
  DOM.i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) return;

    const text = _(key);

    if (node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
      node.placeholder = text;
    } else if (node.tagName === "BUTTON" && node.querySelector("span")) {
      const span = node.querySelector("span");
      if (span && span.dataset.i18n === key) {
        span.textContent = text;
      } else {
        node.textContent = text;
      }
    } else {
      node.textContent = text;
    }
  });
}

function generatePlaceholderQuestions(n = 10) {
  const placeholders = [];
  for (let i = 0; i < n; i++) {
    placeholders.push({
      question: `Placeholder question ${i + 1}`,
      answers: ["Option A", "Option B", "Option C", "Option D"],
      correct: Math.floor(Math.random() * 4),
    });
  }
  return placeholders;
}

/* Initialize */
window.addEventListener("load", () => {
  startApp();
});
