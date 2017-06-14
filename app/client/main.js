import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import './main.html';
import './matchUI.js';

currentAccount = 0;

Template.index.onCreated(async function helloOnCreated() {

  s_Id = currentAccount;
  var events = CongressInstance.matchmakingNotify({fromBlock: 0, toBlock: 'latest'});
  events.watch(function(error, result){
    console.log("listening")
    if (result){
      console.log(result);
      showConfirmation(0);
    }
    // showConfirmation(s_Id);
  });

  // would get all past logs again.
  events.get(function(error, logs){
    if (logs.length >0){
      console.log(logs);
    }
  });


  properties = [];
  propertyType = [];
  initData();

  var res = await callPromise("init");
  if (Meteor.userId() != null){
    Session.set("loggedIn", true);
  }else{
    Session.set("loggedIn", false);
  }

});



Template.index.events({
  '.click .fetch':function(e){

  },
  'click .matchmakingBtn':async function(e){
      //var res = await callPromise("matchmaking");
      //alert(res);
      findOrigin();
      console.log(properties);
  },
  'click .confirmingBtn':async function(e){
      //var res = await callPromise("matchmaking");
      //alert(res);
      checkConfirmation();
      $(".systemInfo").css("transform", "translateX(600px)");

  },
  'click .matchesBtn':function(event){
    var m_Id = $(event.target).attr("class").split("matchBtn")[1];
    MatchmakingInstance.updateConfirmation(m_Id, s_Id, 1, {from:web3.eth.accounts[currentAccount], gas:2000000}, function(err, res){
      if (err){
        console.log(err);
      }
    });

    $(event.target).prop("value", "Waiting");
    $(event.target).prop("disabled", true);
},

})

Template.index.helpers({
  'loggedIn':function(){
    return Session.get("loggedIn");
  }

})

Template.header.events({
  'click .logout':function(){
    Meteor.logout();
    Session.set("loggedIn", false);
  }

});


Template.login.events({
  'click .submit':async function(e){
      var email = $("[name = token]").val();
      var password = $("[name = private]").val();
      Meteor.loginWithPassword({ 'email': email},password, function(err, res){
        if (err){
          alert(err.reason);
          Session.set("loggedIn", false);
        }else{
          alert("welcome");
          Session.set("loggedIn", true);
        }
      });

  }

})


Template.manage.loggedIn=function(){
  return Session.get("loggedIn");
}
