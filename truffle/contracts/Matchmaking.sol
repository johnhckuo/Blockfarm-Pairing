pragma solidity ^0.4.4;

contract Matchmaking{

    uint floatOffset = 1000;
    uint matchMakingThreshold = 500;
    uint matchMakingInterval = 1800;
    uint matchesConfirmThreshold = 2;

    struct Match{
        uint id;
        uint[] visitedOwners;
        uint[] visitedProperties;
        uint[] visitedTradeable;
        bool[] confirmed;

        int256[] visitedPriorities;
        uint[] confirmation;
        uint visitedCount;
        string result;
    }

    Match[] public matches;

    function Matchmaking(){

    }

    function getMatchMaking(uint m_Id) constant returns(int256[], uint[], uint[], uint[], uint[], uint, string){
        return (matches[m_Id].visitedPriorities, matches[m_Id].visitedOwners, matches[m_Id].visitedProperties, matches[m_Id].visitedTradeable, matches[m_Id].confirmation, matches[m_Id].visitedCount, matches[m_Id].result);
    }

    function getMatchMakingConfirmed(uint m_Id, uint s_Id) constant returns(bool){
        return (matches[m_Id].confirmed[s_Id]);
    }

    function updateConfirmation(uint m_Id, uint s_Id, uint confirmation){
        uint s_Index;
        for (uint i = 0 ; i < matches[m_Id].visitedOwners.length; i++){
            if (matches[m_Id].visitedOwners[i] == s_Id){
                s_Index = i;
                break;
            }
        }
        matches[m_Id].confirmation[s_Index] = confirmation;
        matches[m_Id].confirmed[s_Index] = true;
    }

    function getMatchMakingLength() constant returns(uint){
        return matches.length;
    }

    function gameCoreMatchingInit(uint _visitedCount, string _result){
        uint _matchId = matches.length++;

        matches[_matchId].id = _matchId;
        matches[_matchId].visitedCount = _visitedCount;
        matches[_matchId].result = _result;
    }

    function gameCoreMatchingDetail(int256[] _priority, uint[] _owner, uint[] _property, uint[] _tradeables){
        uint _matchId = matches.length-1;
        matches[_matchId].visitedPriorities = _priority;
        matches[_matchId].visitedOwners = _owner;
        matches[_matchId].visitedProperties = _property;
        matches[_matchId].visitedTradeable = _tradeables;


        for (uint i = 0 ; i < matches[_matchId].visitedOwners.length ; i++){
           matches[_matchId].confirmation.push(1);
           matches[_matchId].confirmed.push(false);
        }
    }
}
