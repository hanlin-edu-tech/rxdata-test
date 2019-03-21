const Synchronizer = require('./synchronizer.js');

exports.updateFirestore = (data, context) => {
  const pubSubMessage = data;
  const userId= pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString()
    : null;
  
  if(userId){
    Synchronizer.updateFirestore(userId);
  }
};