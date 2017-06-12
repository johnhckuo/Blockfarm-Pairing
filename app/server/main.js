import { Meteor } from 'meteor/meteor';

// var token = "e22aef855bb045f7904fc4712e7668a9";
// var key = "5477461a4aad31679e223477d67d219a76c99cbeb43e941d53b70ee86d7b1020";
var email = "blockfarm.ssrc@gmail.com";
var password = "Aesl85024";
var initFlag = true;

Meteor.startup(() => {

  Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: null

  });

});


Meteor.methods({
  'init': function(){
    try{
      if (initFlag){
        Accounts.createUser({
            email: email,
            password: password
        });
        console.log("init complete");
        initFlag = !initFlag;
      }else{
        console.log("already inited");
      }
    }catch(e){
      console.log(e);
      return {type:"error", result:e.reason};
    }
    return {type:"success", result:""};
  },
  'matchmaking':function(){

      var res = Promise.await(findOrigin());
      console.log(res);
      return res;
  }
});
