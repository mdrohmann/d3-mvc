module.exports = {};

module.exports.get_unique = function(arr) {
   var u = {}, a = [];
   var l = arr.length;
   var i = 0;
   for(i = 0; i < l; ++i) {
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
};

