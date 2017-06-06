import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import './main.html';

Template.index.onCreated(async function helloOnCreated() {
  var res = await callPromise("init");
  if (Meteor.userId() != null){
    Session.set("loggedIn", true);
  }else{
    Session.set("loggedIn", false);
  }
  console.log(res);

});

Template.index.events({
  '.click .fetch':function(e){

  },
  'click .matchmaking':async function(e){
      var res = await Meteor.call("matchmaking");
  }

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
