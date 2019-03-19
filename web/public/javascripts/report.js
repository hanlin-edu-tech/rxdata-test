$(function(){
  
  firebase.initializeApp(firebaseConfig);

  firebase.auth().signInWithCustomToken(token)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;})
    .then(function(){
      const unExamSub = db.collection("exam").doc(urlParams.get("id")).onSnapshot(function(snapshot){
        updateExam(snapshot.data());
      });
    });

  const db = firebase.firestore();
  const urlParams = new URLSearchParams(window.location.search);

  let unUserSub;
  function updateUser(exam){
    if(!unUserSub){
      unUserSub = db.collection("user").doc(exam.user).onSnapshot(function(userSnapshot){
        let userData = userSnapshot.data();
        $('#user.card .card-content').html(`
          <div class="user">${userData.name}</div>
          <div class="count">
            <span>${userData.correct}</span>
            <span>/</span>
            <span>${userData.total}</span>
            <span>=</span>
            <span>${Math.floor(userData.correct / userData.total * 100)}</span>
            <span>%</span>
          </div>`);
      });
    }}

  function updateScore(exam){
    $('#score.card .card-content').html(`<span class="score">${exam.score}</span>`)
  }

  function updateExam(exam){
    if(exam){
      if(exam.user){
        updateUser(exam);
      }

      if(exam.correct){
        updateScore(exam);
      }      
    }
  }

});