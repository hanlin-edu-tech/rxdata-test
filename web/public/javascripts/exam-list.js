$(function(){

  firebase.initializeApp(firebaseConfig);

  firebase.auth().signInWithCustomToken(token)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;})
    .then(function(){
      db.collection("exam")
        .where("user", "==", userId)
        .onSnapshot(function(querySnapshot){
            $('#loading').remove();
            querySnapshot.docChanges().forEach(function(change){
                if (change.type === "added") {
                  addExam(change.doc.data());
                }
                if (change.type === "modified") {
                  updateExam(change.doc.data());
                }
            });
        });
    });

  const db = firebase.firestore();
  const urlParams = new URLSearchParams(window.location.search);
  const userId = (urlParams.get("id")) ? urlParams.get("id") : "u_0";

  $(`#user option[value="${userId}"]`).attr("selected", "true"); 
  $('#user').change(function(){
    let uid = $(this).val()
    location.href = `/exam-list.html?id=${uid}`;
  });

  function addExam(exam) {
    $('#reports').prepend(`
      <li id="${exam._id}"><span class="finish">${exam.finish.toDate().toLocaleString()}</span> <span class="score">${exam.score}分</span></li>
    `);
  }

  function updateExam(exam) {
    let domExam = $(`#${exam._id}`);
    domExam.find('.finish').text(exam.finish.toDate().toLocaleString());
    domExam.find('.score').text(`${exam.score}分`);
  }

});