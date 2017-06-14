import { Session } from 'meteor/session';

var theta = 0, figureOffset, panelWidth = 210;
var empowerScore, panelCount;
var hidden = true;
var propertyTypeLength, stakeholderLength,propertyLength;
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


var rangeElementBG = function(n, target){
    target.css({
        'background-image':'-webkit-linear-gradient(left ,#7D89DE 0%,#7D89DE '+n+'%,#444444 '+n+'%, #444444 100%)'
    });
}

if (Meteor.isClient) {

    ////////////////////
    //                //
    //     Init       //
    //                //
    ////////////////////

    properties = [];

    stakeholders = [];

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

        propertyTypeLength = 0;
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
                            var pType = { id: res[1].c[0], name: web3.toUtf8(res[0]), avg: res[2].c[0], ratings: res[3] };
                            propertyType.push(pType);
                            Session.set('propertyTypes', propertyType);
                        }
                    });
                }
            }
        });
        stakeholderLength = 0;
        CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                stakeholderLength = res.c[0];
                Session.set('stakeholderLength', stakeholderLength);
                for (var i = 0; i < stakeholderLength; i++) {
                    CongressInstance.getStakeholder(i, { from: web3.eth.accounts[0], gas: 200000 }, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var sholder = { name: web3.toUtf8(res[0]), address: res[1], since: res[2].c[0], matchesId: res[3] };
                            stakeholders.push(sholder);
                            Session.set('stakeholderlist', stakeholders);
                        }
                    });
                }
                propertyLength = 0;
                usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        propertyLength = res.c[0];
                        Session.set('propertyLength', propertyLength);
                        for (var i = 0; i < propertyLength; i++) {
                            usingPropertyInstance.getProperty.call(i, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    var property = { id: res[0].c[0], type:res[1], name: web3.toUtf8(res[2]), count: res[3].c[0], tradable: res[4].c[0], owner:res[5].c[0] };
                                    properties.push(property);
                                    Session.set('properties', properties);

                                }
                            });
                        }
                    }
                });
            }
        });
    });

    ////////////////////
    //                //
    //     Event      //
    //                //
    ////////////////////

    var panelCounter = 1;

    Template.matchmaking.events({
        'click #next': function (e) {
            panelCount = stakeholders.length;
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
            CongressInstance.addMember('CCC', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            CongressInstance.addMember('BBB', { from: web3.eth.accounts[1], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            CongressInstance.addMember('AAA', { from: web3.eth.accounts[2], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });

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
            $('.empower_show .range').each(function (i, obj) {
                values.push($(this).val());
            });
            var id = $('.empower_show input:hidden').val();
            console.log(id);
            for(i = 0; i < values.length; i++){
                usingPropertyInstance.updatePropertyTypeRating(i, id, values[i], 'update', { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            }
        },
        "click #PropertyNext":function(){
            panelCount = stakeholders.length;
            var temp = panelCounter;
            $(".PropertyPanel:nth-child(" + temp + ")").css("z-index", -1);
            setTimeout(function () {
                $(".PropertyPanel:nth-child(" + temp + ")").removeClass("Property_show");
            }, 1000);
            panelCounter = (panelCounter + 1) % panelCount;
            if (panelCounter == 0) {
                panelCounter = panelCount;
            }
            $(".PropertyPanel:nth-child(" + panelCounter + ")").css("z-index", 1);
            $(".PropertyPanel:nth-child(" + panelCounter + ")").addClass("Property_show");
        },

        "click #newProperty": function (e) {
            $(".hiddenDIV").toggleClass("displayNewProperty");
            //setAddProperty();
        },
        "click #property_button" : function(){
            var _owner = $('#propertyOwner').find(':selected').val();
            var _propertyType = $('#propertyType').find(":selected").val();
            var _name = $('#property_name').val();
            var _count = 1;
            var _tradable = 1;
            usingPropertyInstance.addProperty(_name, _owner, _count, '', _propertyType, _tradable, { from: web3.eth.accounts[0], gas: 2000000 }, function (err, res) { if (err) { console.log(err); } else { console.log(res); } });
            //var property = { id: properties.length, type:_propertyType, name: _name, count: _count, tradable: _tradable, owner:_owner };
            //properties.push(property);
            //Session.set('properties',property);
        }
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
                    for (var i = 0 ; i < temp_stakeholder.length; i++) {
                        for (var j = 0 ; j < temp_propertyType.length; j++) {
                            detail.push({
                                "propertyClass": "property" + temp_propertyType[j].id,
                                "name": temp_propertyType[j].name,
                                "value": temp_propertyType[j].ratings[i].c[0],
                            });
                        }

                        var panelClass = "empowerPanel";
                        if (i == 0) {
                            panelClass += " empower_show";
                        }
                        data.push({
                            "className": panelClass,
                            "stakeholder_Id":i,
                            "stakeholder": temp_stakeholder[i].name,
                            "detail": detail
                        });
                        detail = [];
                    }
                }
            }
            catch (e){
                //console.log(e);
            }
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
        },
        Stakeholders:function(){
            var data = [];
            try{
                var temp = Session.get('stakeholderlist');
                for(var i = 0; i < temp.length; i++){
                    data.push({
                        'stakeholderId':i,
                        'name':temp[i].name
                    });
                }
            }
            catch(e){
            }
            return data;
        },
        OwnedProperty : function(){
            var data = [];
            var OwnedProperty = [];
            try{
                var stakeholderLength, propertyLength;
                stakeholderLength =   Session.get('stakeholderLength');
                propertyLength = Session.get('propertyLength');
                temp_stakeholder =  Session.get('stakeholderlist');
                temp_property = Session.get('properties');
                if((temp_property.length != 0) && (temp_property.length == propertyLength)){
                    if((temp_stakeholder.length != 0) && (temp_stakeholder.length == stakeholderLength)){
                        for(i = 0; i < temp_stakeholder.length; i++){
                            temp_stakeholder[i].id = i;
                            tempStakeholder = temp_stakeholder[i];
                            for(j = 0; j < temp_property.length;j++){
                                if(temp_property[j].owner == tempStakeholder.id){
                                    OwnedProperty.push(temp_property[j]);
                                }
                            }
                            var panelClass = "PropertyPanel";
                            if (i == 0) {
                                panelClass += " Property_show";
                            }
                            data.push({
                                'name': tempStakeholder.name,
                                "className": panelClass,
                                'OwnedProperty':OwnedProperty
                            });
                            OwnedProperty = [];
                        }
                    }
                }
            }
            catch(e){}
            return data;
        }
    });
}
