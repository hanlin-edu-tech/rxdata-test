const Calculator = require('./calculator.js');

exports.calculate = (data, context) => {
  const pubSubMessage = data;
  const examId = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString()
    : null;
  
  if(examId){
    Calculator.calculate(examId);
  }
};