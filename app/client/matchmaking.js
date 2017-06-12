import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import colors from 'colors';

colors.enabled = true;

initData = function(){

  usingPropertyInstance.getPropertyTypeLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
      if (err) {
          console.log(err);
      }
      else {
          propertyTypeLength = res.c[0];
          for (var i = 0; i < propertyTypeLength; i++) {
              usingPropertyInstance.getPropertyType.call(i, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
                  if (err) {
                      console.log(err);
                  }
                  else {
                      console.log(res);
                      pType = { id: res[1].c[0], name: web3.toUtf8(res[0]), avg: res[2].c[0], ratings: res[3] };
                      propertyType.push(pType);
                      console.log(propertyType);
                  }
              });
          }
      }
  });

  usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[0] }, function (err, res) {
      if (err) {
          console.log(err);
      }
      else {
          propertyLength = res.c[0];
          for (var i = 0; i < propertyLength; i++) {
              usingPropertyInstance.getProperty.call(i, { from: web3.eth.accounts[0] }, function (err, res) {
                  if (err) {
                      console.log(err);
                  }
                  else {
                      console.log(res);
                      property = { id: res[0].c[0], type: res[1].c[0], name: web3.toUtf8(res[2]), count: res[3].c[0], tradeable: res[4].c[0]};
                      properties.push(property);
                      console.log(property);

                  }
              });
          }

      }
  });

}

// var callContract = function(contract, method, args){
//   var req = prefix;
//   switch (contract){
//     case "GameCore":
//       req += gameCore;
//       break;
//     case "Congress":
//       req += congress;
//       break;
//     case "usingProperty":
//       req += usingProperty;
//       break;
//     case "GameProperty":
//       req += gameProperty;
//       break;
//     case "Matchmaking":
//       req += matchmaking;
//       break;
//     case "PlayerSetting":
//       req += playerSetting;
//       break;
//     default:
//       return "error";
//   }
//   req += "/"+method+ "?token=" + token;
//   updateCall.data.params = args;
//   console.log("request url: "+req);
//   console.log("request args: "+updateCall);
//   return Meteor.http.call("POST",req, updateCall);
//
// }

// for matchmaking

var visitedProperty = [];
var visitedCount;  //in order to ignore the rest of the array elem
var actualVisitIndex = [];
var origin;
var visitedOwner = [];
var visitedPriority = [];

// for confirm

var matches = [];
var matchesConfirmThreshold = 2;

/* ----- Matchmaking Functions ----- */

var sort = function(list){
  //selection sort

    for (var i=0; i < list.length; i++)
    {

        var max_index = i;
        for (var j=i+1; j<list.length; j++){
            if (list[j].priority > list[max_index].priority){
                max_index = j;
            }
        }
        var temp = list[i];
        list[i] = list[max_index];
        list[max_index] = temp;

    }
    return list;
}

var calculateAverage = function(){
  console.log(propertyType);
  console.log(properties);
  for (var i = 0 ; i < propertyType.length ;i++){
    var temp = 0;
    for (var j = 0 ; j < propertyType[i].ratings.length; j++){
      temp += propertyType[i].ratings[j];
    }
    propertyType[i].avg = temp / propertyType[i].ratings.length;
  }
}

findOrigin = function(){

    //reset
    visitedProperty = [];
    visitedCount = 0;  //in order to ignore the rest of the array elem
    actualVisitIndex = [];
    origin = null;
    visitedOwner = [];
    visitedPriority = [];

    visitedCounts = [];
    totalGoThroughList = [];


    calculateAverage();
    //var length = Promise.await(callContract("usingProperty", "getPropertiesLength", []));
    var length = properties.length;

    var priorityList = [];

    for (var i = 0 ; i < length ; i++){
        var access = properties[i].tradeable;
        var isTrading = properties[i].isTrading;

        /*
        var access = Promise.await(callContract("usingProperty", "checkTradeable", [i]));
        var isTrading = Promise.await(callContract("usingProperty", "checkTradingStatus", [i]));
        */
        if (access == 0 || isTrading){
          continue;
        }

        var owner = properties[i].owner;
        var averageRating = propertyType[properties[i].type].avg;
        var self_Importance = propertyType[properties[i].type].ratings[owner];
        /*
        var owner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
        var averageRating = Promise.await(callContract("usingProperty", "getPropertyTypeAverageRating", [i]));
        var self_Importance = Promise.await(callContract("usingProperty", "getPropertyTypeRating_Matchmaking", [i]));
        */
        var diff = averageRating - self_Importance;

        if (diff <= 0){
            continue;
        }

        priorityList.push({
          id:i,
          priority:diff
        });
    }
    priorityList = sort(priorityList);

    if (priorityList.length == 0){
      matchFail(2);
      return "Fail";
    }

    origin = priorityList[0].id;

    visitedCount = 0;
    visitedProperty.push({id : origin, priority : priorityList[0].priority})

    totalGoThroughList.push(priorityList);
    visitedCounts.push(0);

    success = findVisitNode();

    console.log("Entry Point Found: #"+origin);
    //return "success";
    return success;
}

var checkExist = function(elem, data){
    for (var i = 0 ; i < data.length; i++){
        if (elem == data[i].id && i != 0){
            return false;
        }
    }
    return true;
}


var searchNeighborNodes = function(visitNode){
    var length = properties.length;
    //var length = Promise.await(callContract("usingProperty", "getPropertiesLength", []));
    goThroughList = [];

    /*
            var newOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
            var currentOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [visitNode]));
            var currentType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [i]));
            var newType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [visitNode]));
    */

    var k = 0;
    var currentOwner = properties[visitNode].owner;
    var newType = properties[visitNode].type;

    for (var i = 0 ; i < length ; i++){

      var newOwner = properties[i].owner;
      var currentType = properties[i].type;
        //if (i == visitNode || Promise.await(callContract("usingProperty", "checkTradeable", [i])) == 0 || Promise.await(callContract("usingProperty", "checkTradingStatus", [i]))){
        if (i == visitNode || properties[i].tradeable == 0 || properties[i].isTrading || newOwner == currentOwner || currentType == newType){
            continue;
        }


        var diff = returnPriority(visitNode, i);

        if (diff <= 0){
          //this need to be modified to user config
          continue;
        }

        goThroughList.push({
          id:i,
          priority:diff
        });
    }
    console.log("%c[System Log] Current Node :"+visitNode, "color:#FF44AA");

    if (goThroughList.length == 0){
        return matchFail(0);
    }
    goThroughList = sort(goThroughList);

    var flag = false;
    var visitIndex;

    for (var j = 0 ; j< goThroughList.length ; j++){
        flag = checkExist(goThroughList[j].id, visitedProperty);

        if (!flag){

            goThroughList.splice(j, 1);
            j--;
            if (goThroughList.length == 0){
                return matchFail(1);
            }
        }


    }
    // console.log(visitedProperty)
    // console.log("=====");
    // for (var j = 0 ; j< goThroughList.length ; j++){
    //   console.log(goThroughList[j].id);
    // }
    // console.log("=====");


    return goThroughList;
}


var findVisitNode = function(){

  visitingIndex =0;
  var found = false;


  while (!found){

    var found = verifyNode();
    if (found){
      break;
    }

    goThroughList= searchNeighborNodes(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id);

    flag = false;
    // no neighbor nodes
    if (goThroughList == 0){


      // all choices have consumed
      if (totalGoThroughList[visitingIndex].length-1 <= visitedCounts[visitingIndex]){
        // fail if the beginning node also run out of choices
        if (visitingIndex == 0){
          return "Fail";
        // swtich to previous nodes & give up current node
        }else{
          flag = true;
        }
      // switch to secondary choice
      }else{
        visitedCounts[visitingIndex]++;
        visitedProperty[visitedProperty.length-1] = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]];
        console.log("%c[System Log] Now visiting index: " + visitingIndex +", and now switch to prioity #"+(visitedCounts[visitingIndex]+1)+": "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id, "color:#00ff00");
        continue;

      }
    }
    if (!flag)
      registerNode();

    console.log(visitedCounts[visitingIndex]);
    while (flag){
      visitedProperty.splice(visitedProperty.length-1, 1);
      totalGoThroughList.splice(totalGoThroughList.length-1, 1);
      visitedCounts.splice(visitedCounts.length-1, 1);
      visitingIndex--;
      console.log(totalGoThroughList[visitingIndex][0])
      if (totalGoThroughList[visitingIndex].length-1 >= (visitedCounts[visitingIndex]+1)){
        visitedCounts[visitingIndex]++;
        console.log("%c[System Log] Run out of alternative nodes! Switch to previous index #"+ visitingIndex +" node "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id, "color:#00ff00");
        visitedProperty[visitedProperty.length-1] = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]];

        flag = false;
      }
    }
    // register the accessible neighbor node
  }

  return "Success!";
}


var registerNode = function(){
  totalGoThroughList.push(goThroughList);
  visitedCounts.push(0);
  visitingIndex++;
  visitedProperty.push(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]]);

}

var verifyNode = function(){
  if (totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]] != undefined && totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id == origin && visitingIndex != 0){
      console.log("%c----------------------------Success-----------------------------", "color:#00ffff");

      for (var h = 0 ; h < visitedProperty.length ; h++){
          visitedOwner.push(properties[visitedProperty[h].id].owner);
          visitedPriority.push(visitedProperty[h].priority);
      }

      console.log("Visited Property "+visitedOwner);
      console.log("Visited priority "+visitedPriority);

      var matchId = matches.length;

      var tempJson = {};
      tempJson.id = matchId;
      tempJson.visitedCount = visitedCounts;
      tempJson.result = "null";

      tempJson.visitedOwners = visitedOwner;
      tempJson.visitedProperties = visitedProperty;
      tempJson.visitedPriorities = visitedPriority;
      matches.push(tempJson);


      MatchmakingInstance.gameCoreMatchingInit(matchId, visitedOwner.length, "null", function(err, res){
        if (err){
          console.log(err);
        }
        gameCoreMatchingDetail(matchId, visitedPriority, visitedOwner, visitedProperty);


      });


      return true;

  }else{
      if (visitingIndex == 1){
        console.log("%c-------------Commence Node Searching Process---------------", "color:#00ffff");
      }
      return false;

  }
}


var returnPriority = function(visitNode, i){
    var owner = properties[i].owner;
    return propertyType[properties[visitNode].type].ratings[owner];
}

var matchFail = function(errCode){
  switch (errCode){
    case 0:
      console.log("%c[Error Log] No available neighbor nodes", "color: #ff0000");
      break;
    case 1:
      console.log("%c[Error Log] No unvisited neighbor nodes left", "color: #ff0000");
      break;
    case 2:
      console.log("%c[Error Log] No origin entry points found, Abort!", "color: #ff0000");
      break;
  }
  return 0;
}

var matchSuccess = function(){
  return 1;
}



/* ----- check Transaction ----- */

var matches = [];

function checkConfirmation(){
    var length;
    MatchmakingInstance.getMatchMakingLength.call(function(err, res){
      if (err){
        console.log(err);
      }else{
        length = res.c[0];

        for (var i = 0 ; i < length ; i++){
          MatchmakingInstance.getMatchMaking.call(i, function(err, res){
              if (err){
                console.log(err);
              }else{
                var match = { visitedPriorities: res[0], visitedOwners: res[1], visitedProperties: res[2], visitedTradeable: res[3], confirmation: res[4], visitedCount:res[5], result:res[6] };
                matches.push(match);

                for (var j = 0 ; j < matches.length - matchesConfirmThreshold ; j++){
                    var confirm = 0;
                    for (var i = 0 ; i < matches[j].confirmation.length-1; i++){
                        if (matches[j].confirmation[i] == 1){
                            confirm++;
                        }
                        congress.deleteMatchesId(matches[j].visitedOwners[i], matches[j].id);
                    }

                    var totalCount = matches[j].visitedOwners.length;

                    if (confirm/totalCount <= 0.5){
                        matches[j].result = "false";
                        return false;
                    }else{
                        matches[j].result = "true";
                        transferOwnership(j);
                        return true;
                    }
                }
              }
          });
        }
      }
    });
}

function transferOwnership(m_Id){
    var length;
    usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[0]}, function(err, res){
      if (err){
        console.log(err);
      }else{
        length = res.c[0];
        var visitedLength = matches[m_Id].visitedOwners.length-1;
        for (var i = 0 ; i < visitedLength; i++){
            var s_Id = matches[m_Id].visitedOwners[i+1];
            var currentPID = matches[m_Id].visitedProperties[i];
            var propertyType = currentPID % length;
            var receivedPID = s_Id*length + propertyType;

            usingPropertyInstance.updateOwnershipStatus([receivedPID, currentPID], {from:web3.eth.accounts[0]}, function(err, res){
              if (err){
                console.log(err);
              }else{
                //cancel isTrading status
                usingPropertyInstance.updateTradingStatus([currentPID, false], {from:web3.eth.accounts[0]}, function(err, res){
                  if (err){
                    console.log(err);

                  }else{
                    console.log("");
                  }
                });
              }
            });
        }
      }
    })


}

function gameCoreMatchingDetail(_matchId, _priority, _owner, _property){
    matches[_matchId].visitedPriorities = _priority;
    matches[_matchId].visitedOwners = _owner;
    matches[_matchId].visitedProperties = _property;
    console.log(matches);
    matches[_matchId].confirmed = [];
    matches[_matchId].confirmation = [];
    matches[_matchId].visitedTradeable = [];

    for (var i = 0 ; i < matches[_matchId].visitedOwners.length ; i++){
       matches[_matchId].confirmation.push(1);
       matches[_matchId].confirmed.push(false);
       //Promise.await(callContract("usingProperty", "updateTradingStatus", [matches[_matchId].visitedProperties[i], true]));
       usingPropertyInstance.updateTradingStatus(matches[_matchId].visitedProperties[i].id, true, {from:web3.eth.accounts[0], gas:100000}, function(err,res){
         if (err){
           console.log(err);
         }
       })
    }

    for (var k = 0 ; k < matches[_matchId].visitedOwners.length-1 ; k++){
        //Promise.await(callContract("Congress", "insertMatchesId", [matches[_matchId].visitedOwners[k], _matchId]));
        CongressInstance.insertMatchesId(matches[_matchId].visitedOwners[k], _matchId, {from: web3.eth.accounts[0], gas:100000}, function(err, res){
          if (err){
            console.log(err);
          }
        });
    }

    for (var l = 0 ; l < matches[_matchId].visitedProperties.length ; l++){
        usingPropertyInstance.checkTradeable(matches[_matchId].visitedProperties[l].id, {from:web3.eth.accounts[0], gas:100000}, function(err,res){
          if (err){
            console.log(err);
          }else{
            matches[_matchId].visitedTradeable.push(res.c[0]);
          }

        });
    }

}
