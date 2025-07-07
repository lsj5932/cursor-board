document.addEventListener('DOMContentLoaded', function() {
  const questionForm = document.getElementById('question-form');
  const questionInput = document.getElementById('question-input');
  const questionList = document.getElementById('question-list');

  let questions = [];

  // 질문 추가
  questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = questionInput.value.trim();
    if (text) {
      questions.push({ text, answers: [] });
      questionInput.value = '';
      renderQuestions();
    }
  });

  // 질문 목록 렌더링
  function renderQuestions() {
    questionList.innerHTML = '';
    questions.forEach((q, idx) => {
      const li = document.createElement('li');
      li.className = 'question-item';
      li.innerHTML = `
        <div class="question-text">${q.text}</div>
        <div class="answer-section">
          <ul class="answer-list">
            ${q.answers.map(a => `<li>${a}</li>`).join('')}
          </ul>
          <form class="answer-form" data-idx="${idx}">
            <input type="text" class="answer-input" placeholder="답변을 입력하세요" required />
            <button type="submit" class="answer-btn">답변</button>
          </form>
        </div>
      `;
      questionList.appendChild(li);
    });
  }

  // 답변 폼 이벤트 위임
  questionList.addEventListener('submit', function(e) {
    if (e.target.classList.contains('answer-form')) {
      e.preventDefault();
      const idx = e.target.getAttribute('data-idx');
      const input = e.target.querySelector('.answer-input');
      const answer = input.value.trim();
      if (answer) {
        questions[idx].answers.push(answer);
        renderQuestions();
      }
    }
  });
});
