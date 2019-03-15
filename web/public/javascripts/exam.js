$(function(){
    $('#finish').one('click',function(){
        let user = $('#user').val();
        let question = [];
        let answer = [];
        for(let i=0 ; i<5 ; i++){
            question.push(`q_${i}`);
            answer.push(parseInt($(`#q_${i}`).val()));
        }
        $.post('/api/finish',{exam:JSON.stringify({user:user, question:question, answer:answer})},function(data){
            location.href = `/report.html?id=${data}`
        });
    });
});