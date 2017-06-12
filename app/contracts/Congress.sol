pragma solidity ^0.4.4;

contract Congress{

    mapping (address => uint) public stakeholderId;
    Stakeholder[] public stakeholders;
    address owner;

    struct Stakeholder {
        uint256 id;
        bytes32 name;
        address addr;
        uint since;
        uint[] matchesId;
    }

    function Congress(){
       owner = msg.sender;
    }

    function getStakeholdersLength() constant returns(uint){
        return stakeholders.length;
    }

    function getStakeholderId(address addr) constant returns(uint){
        return stakeholderId[addr];
    }

    function getStakeholderAddr(uint s_Id) constant returns(address){
        return stakeholders[s_Id].addr;
    }

    function getStakeholder(uint s_Id) constant returns(bytes32, address, uint, uint[]){
        return (stakeholders[s_Id].name, stakeholders[s_Id].addr, stakeholders[s_Id].since, stakeholders[s_Id].matchesId);
    }

    function getStakeholderMatches(uint s_Id) constant returns(uint[]){
        return (stakeholders[s_Id].matchesId);
    }

    function addMember(bytes32 _name){
        uint id;
        address targetStakeholder = msg.sender;
        if (stakeholderId[targetStakeholder] == 0) {
           stakeholderId[targetStakeholder] = stakeholders.length;
           id = stakeholders.length++;

           stakeholders[id].id = id;
           stakeholders[id].name = _name;
           stakeholders[id].addr = msg.sender;
           stakeholders[id].since = now;
        }
    }

    function insertMatchesId(uint s_Id, uint m_Id){
        stakeholders[s_Id].matchesId.push(m_Id);
    }

    function deleteMatchesId(uint s_Id, uint m_Id){
        uint length = stakeholders[s_Id].matchesId.length;
        for (uint i = stakeholders[s_Id].matchesId[m_Id]; i<length-1; i++){
            stakeholders[s_Id].matchesId[i] = stakeholders[s_Id].matchesId[i+1];
        }
        delete stakeholders[s_Id].matchesId[length-1];
        stakeholders[s_Id].matchesId.length--;
    }

    function removeStakeholder(address targetStakeholder){
        if (stakeholderId[targetStakeholder] == 0) throw;

        for (uint i = stakeholderId[targetStakeholder]; i<stakeholders.length-1; i++){
            stakeholders[i] = stakeholders[i+1];
        }
        delete stakeholders[stakeholders.length-1];
        stakeholders.length--;
    }

}
