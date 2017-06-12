import { Session } from 'meteor/session';
import { Promise } from 'meteor/promise';

contractPromise = (method, contract, contractMethod, args) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, contract, contractMethod, args,  (error, result) => {
            if (error) reject(error);
                resolve(result);
        });
    });
}

loginPromise = (method, email, password) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, email, password, (error, result) => {
            if (error) reject(error);
                resolve(result);
        });
    });
}

callPromise = (method) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, (error, result) => {
            if (error) reject(error);
                resolve(result);
        });
    });
}




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
      avg:65,
      //rating: [20,50,60,40,60,70,20,40,30,90,80,60,40,50,10,40,30,20,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      //rating: [20,100,60, 100, 100,20,40,50,20,10,20,40,60,10,90,90,30,10,30,50],
      //rating: [0,100,80, 80],
      ratings: [0 ,90, 50, 100, 60,30,10]
  },
  {
    id:1,
    avg:85,
    //rating: [40,50,100, 21, 22, 35, 10, 80,44,10,10,40,50,49,90,90,99,4,3,59],
    //rating: [10,10,100, 10],
    ratings: [0, 10, 30, 50, 60, 20,10,2]
  },
  {
    id:2,
    avg:85,
    //rating: [60,30,20,100, 70, 10,50,60,40,40,60,70,80,90,50,10,20,10,90,2],
    ratings: [0,100, 10,20, 50, 90,10, 1],

  },
  {
    id:3,
    avg:65,
    //rating: [100,50,10,50,0,70,50,10,50,60,70,50,10,50,60,70,50,10,50,60],
    ratings: [0,90, 40, 60, 70,30,10,8],

  },
  {
    id:4,
    avg:55,
    ratings: [30,10, 80 , 80, 80,40, 10,9],
  },
  {
    id:5,
    avg:55,
    ratings: [0,10, 80 , 80, 80,10, 100,10],
  },
  {
    id:6,
    avg:70,
    ratings: [0,20,90,20,10,10,10,100],
  },
  {
    id:7,
    avg:70,
    ratings: [0,20,90,20,10,100,10,10],
  },
  // {
  //   id:6,
  //   averageRating:70,
  //   rating: [20,60,100,40,10, 19, 48, 38,59,60,10,100,20,30,40,50,10,50,60,79],
  // },
  // {
  //   id:7,
  //   averageRating:70,
  //   rating: [30,20,90,100,20, 90,49,69,10,30,40,50,60,50,10,90,90,100,10,20],
  // },
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
  {name : "dd",
   owner: 3,
   type:3,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "dd",
   owner: 4,
   type:4,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "dd",
   owner: 5,
   type:5,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "dd",
   owner: 6,
   type:6,
   count:2,
   tradeable:2,
   isTrading:false

  },
  {name : "dd",
   owner: 7,
   type:7,
   count:2,
   tradeable:2,
   isTrading:false

  },
  // {name : "cc",
  //  owner: 3,
  //  type:3,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "bb",
  //  owner: 0,
  //  type:4,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "cccc",
  //  owner: 4,
  //  type:4,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "ddd",
  //  owner: 5,
  //  type:5,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "ssss",
  //  owner: 6,
  //  type:6,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "aa",
  //  owner: 7,
  //  type:7,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // //-----
  // {name : "ss",
  //  owner: 6,
  //  type:6,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "aa",
  //  owner: 7,
  //  type:4,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "dd",
  //  owner: 10,
  //  type:3,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  //
  // },
  // {name : "cc",
  //  owner: 4,
  //  type:2,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "bb",
  //  owner: 1,
  //  type:6,
  //  count:2,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "cccc",
  //  owner: 9,
  //  type:4,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "ddd",
  //  owner: 5,
  //  type:7,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "ssss",
  //  owner: 15,
  //  type:1,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
  // {name : "aa",
  //  owner: 20,
  //  type:0,
  //  count:4,
  //  tradeable:2,
  //  isTrading:false
  // },
];
