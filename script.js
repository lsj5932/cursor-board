// Firestore db 객체는 index.html에서 이미 선언됨 (const db = firebase.firestore();)

document.addEventListener('DOMContentLoaded', function() {
  const questionForm = document.getElementById('question-form');
  const questionInput = document.getElementById('question-input');
  const questionList = document.getElementById('question-list');

  // Firestore에서 실시간으로 질문 목록을 받아옴
  db.collection('questions').orderBy('created', 'desc').onSnapshot(snapshot => {
    const questions = [];
    snapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    renderQuestions(questions);
  });

  // 질문 추가
  questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = questionInput.value.trim();
    if (text) {
      db.collection('questions').add({
        text,
        answers: [],
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        questionInput.value = '';
      });
    }
  });

  // 질문 목록 렌더링
  function renderQuestions(questions) {
    questionList.innerHTML = '';
    questions.forEach((q, idx) => {
      const li = document.createElement('li');
      li.className = 'question-item';
      li.innerHTML = `
        <div class="question-text">${q.text}</div>
        <div class="answer-section">
          <ul class="answer-list">
            ${(q.answers || []).map(a => `<li>${a}</li>`).join('')}
          </ul>
          <form class="answer-form" data-id="${q.id}">
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
      const id = e.target.getAttribute('data-id');
      const input = e.target.querySelector('.answer-input');
      const answer = input.value.trim();
      if (answer) {
        // 해당 질문의 answers 배열에 답변 추가 (arrayUnion 사용)
        db.collection('questions').doc(id).update({
          answers: firebase.firestore.FieldValue.arrayUnion(answer)
        }).then(() => {
          input.value = '';
        });
      }
    }
  });
});
