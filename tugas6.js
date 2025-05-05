let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;
let questions = [];

// Tampilkan section
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

// Mulai kuis
async function startQuiz() {
  try {
    const response = await fetch("soal.json");
    const data = await response.json();

    questions = data;
    showSection("quiz");
    resetQuiz();
    showQuestion();
    startTimer();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

// Reset kuis
function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 15;
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = "15";
}

// Tampilkan pertanyaan
function showQuestion() {
  const question = questions[currentQuestion];
  document.getElementById("question-container").innerHTML = `
                <h3>Pertanyaan ${currentQuestion + 1}</h3>
                <p class="lead">${question.pertanyaan}</p>
            `;

  document.getElementById("options-container").innerHTML = question.pilihan
    .map(
      (option, index) => `
                    <div class="option-card" 
                         onclick="handleAnswer(${index})"
                         data-answer="${option}">
                        ${option}
                    </div>
                `
    )
    .join("");

  document.getElementById("next-btn").disabled = true;
}

// Handle jawaban
function handleAnswer(selectedIndex) {
  clearInterval(timerInterval);
  const options = document.querySelectorAll(".option-card");
  const question = questions[currentQuestion];
  const correctAnswer = question.jawaban_benar;

  options.forEach((option, index) => {
    option.style.pointerEvents = "none";

    // Tandai jawaban benar
    if (option.dataset.answer === correctAnswer) {
      option.classList.add("correct");
    }

    // Tandai jawaban salah yang dipilih
    if (index === selectedIndex && option.dataset.answer !== correctAnswer) {
      option.classList.add("wrong");
    }
  });

  // Update skor
  if (question.pilihan[selectedIndex] === correctAnswer) {
    score += 10;
    document.getElementById("score").textContent = score;
  }

  document.getElementById("next-btn").disabled = false;
}

// Timer
function startTimer() {
  const timerElement = document.getElementById("time");
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(-1); // Auto skip jika melebihi waktu
    }
  }, 1000);
}

// Tombol next
document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    timeLeft = 15;
    document.getElementById("time").textContent = timeLeft;
    showQuestion();
    startTimer();
  } else {
    showResult();
  }
});

// Tampilkan hasil
function showResult() {
  showSection("result");
  document.getElementById("final-score").textContent = score;
}
