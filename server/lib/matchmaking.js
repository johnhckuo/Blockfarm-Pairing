import { Meteor } from 'meteor/meteor';

var callContract = function(contract, method, args){
  var req = prefix;
  switch (contract){
    case "GameCore":
      req += gameCore;
      break;
    case "Congress":
      req += congress;
      break;
    case "usingProperty":
      req += usingProperty;
      break;
    case "GameProperty":
      req += gameProperty;
      break;
    case "Matchmaking":
      req += matchmaking;
      break;
    case "PlayerSetting":
      req += playerSetting;
      break;
    default:
      return "error";
  }
  req += "/"+method+ "?token=" + token;
  updateCall.data.params = args;
  console.log("request url: "+req);
  console.log("request args: "+updateCall);
  return Meteor.http.call("POST",req, updateCall);

}

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
  for (var i = 0 ; i < propertyType.length ;i++){
    var temp = 0;
    for (var j = 0 ; j < propertyType[i].rating.length; j++){
      temp += propertyType[i].rating[j];
    }
    propertyType[i].averageRating = temp / propertyType[i].rating.length;
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
        var averageRating = propertyType[properties[i].type].averageRating;
        var self_Importance = propertyType[properties[i].type].rating[owner];
        /*
        var owner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
        var averageRating = Promise.await(callContract("usingProperty", "getPropertyTypeAverageRating", [i]));
        var self_Importance = Promise.await(callContract("usingProperty", "getPropertyTypeRating_Matchmaking", [i]));
        */
        var diff = averageRating - self_Importance;

        priorityList.push({
          id:i,
          priority:diff
        });
    }
    priorityList = sort(priorityList);

    origin = priorityList[0].id;

    visitedCount = 0;
    visitedProperty.push({id : origin, priority : 0})

    success = findVisitNode(origin);

    console.log("Entry Point Found: #"+origin);
    //$(".origin").html(origin);
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
    var goThroughList = [];


    /*
            var newOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
            var currentOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [visitNode]));
            var currentType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [i]));
            var newType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [visitNode]));
    */


    for (var i = 0 ; i < length ; i++){
      var k = 0;

      var newOwner = properties[i].owner;
      var currentOwner = properties[visitNode].owner;
      var currentType = properties[i].type;
      var newType = properties[visitNode].type;
        //if (i == visitNode || Promise.await(callContract("usingProperty", "checkTradeable", [i])) == 0 || Promise.await(callContract("usingProperty", "checkTradingStatus", [i]))){
        if (i == visitNode || properties[i].tradeable == 0 || properties[i].isTrading || newOwner == currentOwner || currentType == newType){
            k++;
            goThroughList.push({
              id:i,
              priority:-100000
            });
            continue;
        }

        if (k >= length-1){
            matchFail();
        }


        var diff = returnPriority(visitNode, i);
        goThroughList.push({
          id:i,
          priority:diff
        });
    }
    return goThroughList;
}

var findVisitNode = function(visitNode){

    var goThroughList = [];

    goThroughList= searchNeighborNodes(visitNode);
    goThroughList = sort(goThroughList);


    if (goThroughList[0].priority <= 0){
      matchFail();
      return "Fail";
    }

    var flag = false;
    var visitIndex;

    for (var j = 0 ; j< properties.length ; j++){
        flag = checkExist(goThroughList[j].id, visitedProperty);
        if (flag){
            visitIndex = j;
            break;
        }
        //if (!flag && j == (getPropertyLength(1)-1)){
        if (!flag && j == properties.length-1){

            matchFail();
            return "Fail";
        }
    }


    visitedCount++;
    visitedProperty[visitedCount] = goThroughList[visitIndex];
    //visitedOwner[visitedCount] = properties[goThroughList[visitIndex]].owner
    for (var h = 0 ; h < visitedProperty.length ; h++){
        //visitedOwners.push(Promise.await(callContract("usingProperty", "getPropertiesOwner", [visitedProperty[h]])));
        visitedOwner.push(properties[visitedProperty[h].id].owner);
        visitedPriority.push(visitedProperty[h].priority);
    }

    if (goThroughList[visitIndex].id == origin){


        //var matchId = Promise.await(callContract("Matchmaking", "getMatchMakingLength", []));
        var matchId = matches.length;

        // Promise.await(callContract("Matchmaking", "gameCoreMatchingInit", ));
        var tempJson = {};
        tempJson.id = matchId;
        tempJson.visitedCount = visitedCount;
        tempJson.result = "null";


        tempJson.visitedOwner = visitedOwner;
        tempJson.visitedProperties = visitedProperty;
        tempJson.visitedPriorities = visitedPriority;
        matches.push(tempJson);
        // for (var m = 0 ; m < visitedProperty.length ; m++){
        //     Promise.await(callContract("Matchmaking", "gameCoreMatchingDetail", [matchId, visitedPriority[m], visitedOwners[m], visitedProperty[m]]));
        // }
        //$(".property").html(visitedProperty);
        //$(".owner").html(visitedOwner);
        matchSuccess();
        return "Success";

    }else{
        while (findVisitNode(goThroughList[visitIndex].id) == "Fail"){
            matchFail();
        }
    }

}


var returnPriority = function(visitNode, i){

    var owner = properties[i].owner;
    //var owner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
    //owner = Promise.await(callContract("Congress", "stakeholderId", []));

    //var self_Importance = Promise.await(callContract("usingProperty", "getPropertyTypeRating_Matchmaking", [i, owner]));
    var self_Importance = propertyType[properties[i].type].rating[owner];

    //var currentRating = Promise.await(callContract("usingProperty", "getPropertyTypeRating_Matchmaking", [visitNode, owner]));
    var currentRating = propertyType[properties[visitNode].type].rating[owner];

    var diff = currentRating - self_Importance;
    //var tradeableCount = Promise.await(callContract("usingProperty", "checkTradeable", [i]));
    var tradeableCount = properties[i].tradeable;

    tradeableCount = (tradeableCount/10)%10;
    diff += diff/10*tradeableCount;

    return diff;
}

var matchFail = function(){

  console.log("======================Fail======================");
  console.log(visitedProperty);
  console.log(visitedOwner);
}

var matchSuccess = function(){
  console.log("======================Success======================");
  console.log(visitedProperty);
  console.log(visitedOwner);
}



/* ----- check Transaction ----- */

function checkConfirmation(){
    var length = Promise.await(callContract("Matchmaking", "getMatchMakingLength", []));
    for (var i = 0 ; i < length ; i++){
        Promise.await(callContract("Matchmaking", "getMatchMaking", [i]));
    }

    for (var j = 0 ; j < matches.length - matchesConfirmThreshold ; j++){
        var confirm = 0;
        for (var i = 0 ; i < matches[j].confirmation.length-1; i++){
            if (matches[j].confirmation[i] == 1){
                confirm++;
            }
            congress.deleteMatchesId(matches[j].visitedOwners[i], matches[j].id);
        }

        confirm = confirm*floatOffset;
        var totalCount = matches[j].visitedCount;

        if (confirm/totalCount <= matchMakingThreshold){
            matches[j].result = "false";
            return false;
        }else{
            matches[j].result = "true";
            transferOwnership(j);
            return true;
        }

    }

}

function transferOwnership(m_Id){
    var length = Promise.await(callContract("usingProperty", "getPropertyTypeLength", []));
    var visitedLength = matches[m_Id].visitedOwners.length-1;
    for (var i = 0 ; i < visitedLength; i++){
        var s_Id = matches[m_Id].visitedOwners[i+1];
        var currentPID = matches[m_Id].visitedProperties[i];
        var propertyType = currentPID % length;
        var receivedPID = s_Id*length + propertyType;

        Promise.await(callContract("usingProperty", "updateOwnershipStatus", [receivedPID, currentPID]));

        //cancel isTrading status
        Promise.await(callContract("usingProperty", "updateTradingStatus", [currentPID, false]));

        var p_Type = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [matches[m_Id].visitedProperties[i]]));
        if (p_Type > 29 && p_Type < 40){
            Promise.await(callContract("Congress", "updateGuardMatchId", [matches[m_Id].visitedOwners[i], m_Id]));
            Promise.await(callContract("Congress", "updateGuardId", [matches[m_Id].visitedOwners[i+1], matches[m_Id].visitedOwners[i]]));
            Promise.await(callContract("Congress", "updateFarmerId", [matches[m_Id].visitedOwners[i], matches[m_Id].visitedOwners[i+1]]));

        }
    }

}

function gameCoreMatchingDetail(_matchId, _priority, _owner, _property){
    matches[_matchId].visitedPriorities.push(_priority);
    matches[_matchId].visitedOwners.push(_owner);
    matches[_matchId].visitedProperties.push(_property);


    for (var i = 0 ; i < matches[_matchId].visitedOwners.length ; i++){
       matches[_matchId].confirmation.push(1);
       matches[_matchId].confirmed.push(false);
       Promise.await(callContract("usingProperty", "updateTradingStatus", [matches[_matchId].visitedProperties[i], true]));
    }

    for (var k = 0 ; k < matches[_matchId].visitedOwners.length-1 ; k++){
        Promise.await(callContract("Congress", "insertMatchesId", [matches[_matchId].visitedOwners[k], _matchId]));
    }

    for (var l = 0 ; l < matches[_matchId].visitedProperties.length ; l++){
        var temp = Promise.await(callContract("usingProperty", "checkTradeable", [matches[_matchId].visitedProperties[l]]));
         matches[_matchId].visitedTradeable.push(temp);
    }

}
