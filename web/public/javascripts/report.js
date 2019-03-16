$(function(){
  
  firebase.initializeApp(firebaseConfig);

  firebase.auth().signInWithCustomToken(token).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  const db = firebase.firestore();
  
  const urlParams = new URLSearchParams(window.location.search);
  db.collection("exam").doc(urlParams.get("id")).onSnapshot(function(snapshot){
    console.log(snapshot.data());
  });

});