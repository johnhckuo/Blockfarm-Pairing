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
