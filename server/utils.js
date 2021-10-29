module.exports = {
  makeid,
}
var os = require("os");
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result +=  characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   podName = os.hostname();
   final = podName.substring(podName.lastIndexOf('-') + 1);
   //final = final.replace(/\D/g, '');
   result = final+'x'+result;
   return result;
}
