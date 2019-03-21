const Synchronizer = require('./synchronizer.js');

exports.updateFirestore = (data, context) => {
  const pubSubMessage = data;
  const examId = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString()
    : null;
  
  if(examId){
    Synchronizer.updateFirestore(examId);
  }
};