document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.getElementById('quiz-form');
  const addQuestionButton = document.getElementById('add-question');
  const saveQuizButton = document.getElementById('save-quiz');
  const startQuizButton = document.getElementById('load-quiz');
  const submitQuizButton = document.getElementById('submit-quiz');
  const quizQuestionsDiv = document.getElementById('quiz-questions');
  const quizResultsDiv = document.getElementById('quiz-results');
  const selectQuiz = document.getElementById('select-quiz');

  let questions = [];
  let currentQuiz = [];

  addQuestionButton.addEventListener('click', addQuestion);
  saveQuizButton.addEventListener('click', saveQuiz);
  startQuizButton.addEventListener('click', loadQuiz);
  submitQuizButton.addEventListener('click', submitQuiz);

  loadQuizTitles();

  function addQuestion() {
    const question = document.getElementById('question').value;
    const options = [
      document.getElementById('option1').value,
      document.getElementById('option2').value,
      document.getElementById('option3').value,
      document.getElementById('option4').value
    ];
    const correct = document.getElementById('correct').value;

    if (question && options.every(option => option)) {
      questions.push({ question, options, correct });
      alert('Question added!');
      quizForm.reset();
    } else {
      alert('Please fill in all fields.');
    }
  }

  function saveQuiz() {
    const quizTitle = document.getElementById('quiz-title').value;

    if (!quizTitle) {
      alert('Please enter a quiz title.');
      return;
    }

    if (questions.length > 0) {
      localStorage.setItem(quizTitle, JSON.stringify(questions));
      alert('Quiz saved!');
      questions = [];
      quizForm.reset();
      loadQuizTitles();
    } else {
      alert('Please add some questions first.');
    }
  }

  function loadQuizTitles() {
    selectQuiz.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
      const quizTitle = localStorage.key(i);
      const option = document.createElement('option');
      option.value = quizTitle;
      option.textContent = quizTitle;
      selectQuiz.appendChild(option);
    }
  }

  function loadQuiz() {
    const selectedQuiz = selectQuiz.value;
    if (selectedQuiz) {
      const quizData = localStorage.getItem(selectedQuiz);
      if (quizData) {
        currentQuiz = JSON.parse(quizData);
        renderQuiz();
        startQuizButton.style.display = 'none';
        submitQuizButton.style.display = 'block';
      } else {
        alert('Quiz data not found.');
      }
    } else {
      alert('Please select a quiz.');
    }
  }

  function renderQuiz() {
    quizQuestionsDiv.innerHTML = '';
    currentQuiz.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('quiz-section');

      const questionTitle = document.createElement('h3');
      questionTitle.textContent = q.question;
      questionDiv.appendChild(questionTitle);

      q.options.forEach((option, i) => {
        const optionLabel = document.createElement('label');
        optionLabel.innerHTML = `
          <input type="radio" name="question${index}" value="${i + 1}"> ${option}
        `;
        questionDiv.appendChild(optionLabel);
      });

      quizQuestionsDiv.appendChild(questionDiv);
    });
  }

  function submitQuiz() {
    let score = 0;
    currentQuiz.forEach((q, index) => {
      const selected = document.querySelector(`input[name="question${index}"]:checked`);
      if (selected && selected.value === q.correct) {
        score++;
      }
    });
    quizResultsDiv.textContent = `You scored ${score} out of ${currentQuiz.length}`;
    submitQuizButton.style.display = 'none';
    startQuizButton.style.display = 'block';
    quizQuestionsDiv.innerHTML = '';
  }
});
