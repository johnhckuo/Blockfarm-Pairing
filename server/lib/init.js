import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*----------------------
    init declaration
-----------------------*/

token = "e22aef855bb045f7904fc4712e7668a9";

gameCore = "d5263110c2307e402406060097bce70fb9847ced";
matchmaking= "4b205306c3739bdfbe860993b96bf0f264c9a561";
playerSetting = "c278f117445bbb155c3d1f82e2eda3360b153ba3";
gameProperty = "e0de742ed43942f9a38790c1cb729105bb3cacdf";
usingProperty = "bfc454a9f57d47a81c31c2705aafff8871dfb9a8";
congress = "c770df271b8ee62c5cf6ffb60ee146381b880fc2";


prefix = "https://api.blockcypher.com/v1/beth/test/contracts/";

call = {
    "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
    "gas_limit": 2000000
};

updateCall = {
    "data":{
      "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
      "gas_limit": 2000000,
    },
    "header":"Content-Type:application/json"

};

faucet = {
    "address": "d2e4ace3e8ab6debf8360321caeba2c3a15b7d63",
    "amount": 1000000000000000000
};


//-------


matches = [];

// uint id;
// uint[] visitedOwners;
// uint[] visitedProperties;
// uint[] visitedTradeable;
// bool[] confirmed;
//
// int256[] visitedPriorities;
// uint[] confirmation;
// uint visitedCount;
// string result;

propertyType = [
  {
      id:0,
      averageRating:65,
      //rating: [20,50,60,40,60,70,20,40,30,90,80,60,40,50,10,40,30,20,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rating: [20,50,60, 100, 100,20,40,50,20,10,20,40,60,10,90,90,30,10,30,50],

  },
  {
    id:1,
    averageRating:85,
    rating: [40,50,80, 21, 22, 35, 10, 80,44,10,10,40,50,49,90,90,99,4,3,59],
  },
  {
    id:2,
    averageRating:85,
    rating: [60,30,20,50, 70, 10,50,60,40,40,60,70,80,90,50,10,20,10,90,2],
  },
  {
    id:3,
    averageRating:65,
    rating: [70,50,10,50,60,70,50,10,50,60,70,50,10,50,60,70,50,10,50,60],
  },
  {
    id:4,
    averageRating:55,
    rating: [30,10,70,30,30, 10,50,60,40,40, 39, 29,59,69,28,18,28,48,58,60],
  },
  {
    id:5,
    averageRating:70,
    rating: [30,20,90,20,10,10,60,90,39,59,19,59,100,100,45,38,59,69,79,59,29],
  },
  {
    id:6,
    averageRating:70,
    rating: [20,60,100,40,10, 19, 48, 38,59,60,10,100,20,30,40,50,10,50,60,79],
  },
  {
    id:7,
    averageRating:70,
    rating: [30,20,90,100,20, 90,49,69,10,30,40,50,60,50,10,90,90,100,10,20],
  },
];

properties = [
  {name : "ss",
   owner: 0,
   type:0,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "aa",
   owner: 1,
   type:1,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "dd",
   owner: 2,
   type:2,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "cc",
   owner: 0,
   type:1,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "bb",
   owner: 1,
   type:3,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "cccc",
   owner: 4,
   type:4,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "ddd",
   owner: 5,
   type:5,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "ssss",
   owner: 6,
   type:6,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "aa",
   owner: 7,
   type:7,
   count:4,
   tradeable:2,
   isTrading:false
  },
  //-----
  {name : "ss",
   owner: 6,
   type:6,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "aa",
   owner: 7,
   type:4,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "dd",
   owner: 10,
   type:3,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "cc",
   owner: 4,
   type:2,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "bb",
   owner: 1,
   type:6,
   count:2,
   tradeable:2,
   isTrading:false
  },
  {name : "cccc",
   owner: 9,
   type:4,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "ddd",
   owner: 5,
   type:7,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "ssss",
   owner: 15,
   type:1,
   count:4,
   tradeable:2,
   isTrading:false
  },
  {name : "aa",
   owner: 20,
   type:0,
   count:4,
   tradeable:2,
   isTrading:false
  },
];
