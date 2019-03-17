$(function(){
  
  firebase.initializeApp(firebaseConfig);

  firebase.auth().signInWithCustomToken(token).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  const db = firebase.firestore();
  const urlParams = new URLSearchParams(window.location.search);

  let unUserSub;
  function updateUser(exam){
    if(!unUserSub){
      unUserSub = db.collection("user").doc(exam.user).onSnapshot(function(userSnapshot){
        $('#user.card .card-content').html(`<span class="user">${userSnapshot.data().name}</span>`)
      });
    }
  }

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

  const unExamSub = db.collection("exam").doc(urlParams.get("id")).onSnapshot(function(snapshot){
    updateExam(snapshot.data());
  });

});