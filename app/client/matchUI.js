import { Session } from 'meteor/session';

var theta = 0, figureOffset, panelWidth = 210;
var empowerScore, panelCount;
var hidden = true;

stakeholders = [];
properties = [];
empowerment_links = [];

var lineWidthOffset = 20, defaultLineWidth = 1;

////////////////////
//                //
//     Utility    //
//     Function   //
//                //
////////////////////


var dataReset = function(){
    for (var i = 0 ; i< properties.length; i++){
        properties[i].rating = [];
        properties[i].averageImportance = 0;
    }
    empowerment_links = [];
    stakeholders = [];
}

var rangeElementBG = function(n, target){
    target.css({
        'background-image':'-webkit-linear-gradient(left ,#7D89DE 0%,#7D89DE '+n+'%,#444444 '+n+'%, #444444 100%)'
    });
}

var getPropertyLength = function(type){
    var counter = 0;
    for (var i = 0 ; i < properties.length; i++){
        if (type ==1){
            if (properties[i].used ==1){
                counter++;
            }
        }else if (type ==0){
            if (properties[i].used ==0){
                counter++;
            }
        }
    }
}

if (Meteor.isClient) {

    ////////////////////
    //                //
    //     Init       //
    //                //
    ////////////////////

    properties = [
    { id: 0, name: "aaa", rating: [], owner: 1, averageImportance: 0, used: 1 },
    { id: 1, name: "bbb", rating: [], owner: 1, averageImportance: 0, used: 1 },
    { id: 2, name: "ccc", rating: [], owner: 2, averageImportance: 0, used: 1 },
    { id: 3, name: "ddd", rating: [], owner: 2, averageImportance: 0, used: 0 },
    { id: 4, name: "eee", rating: [], owner: 2, averageImportance: 0, used: 0 },
    { id: 5, name: "fff", rating: [], owner: 1, averageImportance: 0, used: 0 }

    ];

    stakeholders = [{id:1,name:'a'}];

    propertyType = [];

    setAddProperty = function () {
        console.log(Session.get('propertyTypes'));
        var table, tr, td, property_index;
        $('.hiddenDIV').html('');
        table = $('<table></table>').attr('id', 'property_table');
        //header
        tr = $('<tr></tr>');
        tr.append($('<th></th>').attr('colspan', 2).text('Adding New Property'))
        table.append(tr);
        //header
        //content
        tr = $('<tr></tr>');
        tr.append($('<td></td>').text('Property Type'));
        td = $('<td></td>');
        td.append($('<select></select>', {
            id: 'selPropertyType',
            name: 'selPropertyType',
            class: 'newProperty_input'
        }));

        console.log(propertyType.length);
        for (i = 0; i < propertyType.length; i++) {
            $('#selPropertyType').append($('<option></option>').attr('value', propertyType[i].id).text(propertyType[i].name));
        }
        tr.append(td);
        table.append(tr);
        tr = $('<tr></tr>');
        td = $('<td></td>');
        td.append($('<input>', {
            type: 'input',
            id: 'property_name',
            class: 'newProperty_input'
        }));
        table.append(tr);

        //content
        $('.hiddenDIV').append(table);
    };


    Template.matchmaking.onRendered(function () {
        //var propertyTypeLength = 0;
        //usingPropertyInstance.getPropertyTypeLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
        //    if (err) {
        //        console.log(err);
        //    }
        //    else {
        //        propertyTypeLength = res.c[0];
        //        for (var i = 0; i < propertyTypeLength; i++) {
        //            usingPropertyInstance.getPropertyType.call(i, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
        //                if (err) {
        //                    console.log(err);
        //                }
        //                else {
        //                    var pType = { id: res[1].c[0], name: web3.toUtf8(res[0]), avg: res[2].c[0], ratings: res[3] };
        //                    propertyType.push(pType);
        //                    Session.set('propertyTypes', propertyType);
        //                    console.log(pType);
        //                }
        //            });
        //        }
        //    }
        //});
        var stakeholderLength = 0;
        CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
           if (err) {
               console.log(err);
           }
           else {
               stakeholderLength = res.c[0];
               console.log(stakeholderLength);
               for (var i = 0; i < stakeholderLength; i++) {
                   CongressInstance.getStakeholder(i, { from: web3.eth.accounts[0], gas: 200000 }, function (err, res) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           var sholder = { id: i, name: web3.toUtf8(res[0]), address: res[1], since: res[2].c[0], matchesId: res[3] };
                           stakeholders.push(sholder);
                           Session.set('stakeholderlist', stakeholders);
                           console.log(sholder);
                       }
                   });
               }
           }
        });
        //var propertyLength = 0;
        //usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
        //    if (err) {
        //        console.log(err);
        //    }
        //    else {
        //        propertyLength = res.c[0];
        //        console.log(propertyLength);
        //        for (var i = 0; i < propertyLength; i++) {
        //            usingPropertyInstance.getProperty.call(i, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
        //                if (err) {
        //                    console.log(err);
        //                }
        //                else {
        //                    var property = { id: res[0].c[0], type:res[1], name: web3.toUtf8(res[2]), count: res[3].c[0], tradable: res[4] };
        //                    properties.push(property);
        //                    Session.set('properties', properties);
        //                    console.log(property);
        //                }
        //            });
        //        }
        //    }
        //});

    });

    ////////////////////
    //                //
    //     Event      //
    //                //
    ////////////////////

    var panelCounter = 1;

    Template.matchmaking.events({
        'click #next': function (e) {
            var temp = panelCounter;
            $(".empowerPanel:nth-child(" + temp + ")").css("z-index", -1);
            setTimeout(function () {
                $(".empowerPanel:nth-child(" + temp + ")").removeClass("empower_show");
            }, 1000);
            panelCounter = (panelCounter + 1) % panelCount;
            if (panelCounter == 0) {
                panelCounter = panelCount;
            }
            $(".empowerPanel:nth-child(" + panelCounter + ")").css("z-index", 1);
            $(".empowerPanel:nth-child(" + panelCounter + ")").addClass("empower_show");
        },
        'click #test': function () {
            CongressInstance.addMember('James', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            CongressInstance.addMember('BBB', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });

            usingPropertyInstance.addPropertyType('Car', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addPropertyType('Shirt', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addPropertyType('Real Estate', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('Benz', 0, 1, '', 0, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('SuperDry', 0, 2, '', 1, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('Nippon Blue', 0, 1, '', 1, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('Toyota', 1, 1, '', 0, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('SuperShy', 1, 2, '', 1, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('Dorm', 0, 2, '', 2, 1, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addProperty('Yamaha', 1, 2, '', 0, 2, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            usingPropertyInstance.addPropertyType('PC', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
        },
        'mouseenter .range, click .range': function (e) {
            var r = $(e.target);
            var p = r.val();
            p = r.val();
            rangeElementBG(p, r);
        },
        'mouseenter .range, mousemove .range': function (e) {
            var r = $(e.target);
            var p = r.val();
            p = r.val();
            rangeElementBG(p, r);
        },
        "click #empowerTest": function (e) {
            var values = [];
            $('.empowerContent .range').each(function (i, obj) {
                values.push($(this).val());
            });
        },

        "click #newProperty": function (e) {
            $(".hiddenDIV").toggleClass("displayNewProperty");
            //setAddProperty();
        },
        "click .addProperty": function (e) {
            var id = $(e.target).parent()[0].className;
            id = id.split("newProperty")[1];
            console.log(id);
            var index;

            for (var i = 0 ; i < properties.length; i++) {
                if (properties[i].id == id) {
                    properties[i].used = 1;
                    index = i;
                    break;
                }
            }
            updateEmpowermentData('insert', properties[index]);
        },
    });


    ////////////////////
    //                //
    //     Helpers    //
    //                //
    ////////////////////

    Template.matchmaking.helpers({

        properties: function () {
            var data = [];
            var detail = [];
            var temp_stakeholder,temp_propertyType;
            try{
                temp_stakeholder =  Session.get('stakeholderlist');
                temp_propertyType = Session.get('propertyTypes');

                if((temp_stakeholder.length != 0)&&(temp_propertyType.length != 0)){
                    panelCount = temp_stakeholder.length;
                    //stakeholders
                    for (var i = 0 ; i < temp_stakeholder.length; i++) {
                        for (var j = 0 ; j < temp_propertyType.length; j++) {
                            detail.push({
                                "propertyClass": "property" + temp_propertyType[j].id,
                                "name": temp_propertyType[j].name,
                                "value": temp_propertyType[j].rating[i],
                            });
                        }

                        var panelClass = "empowerPanel";
                        if (i == 0) {
                            panelClass += " empower_show";
                        }

                        data.push({
                            "className": panelClass,
                            "stakeholder": temp_stakeholder[i].name,
                            "detail": detail
                        });
                        detail = [];
                    }
                }
            }
            catch (e){}
            return data;
        },
        propertyTypes: function () {
            var data = [];
            try{
                var temp = Session.get('propertyTypes');
                for (var i = 0 ; i < temp.length; i++) {
                    data.push({
                        "propertyTypeId": temp[i].id,
                        "name": temp[i].name,
                    });
                }
            }catch(e){}
            return data;
        }
    });
}
