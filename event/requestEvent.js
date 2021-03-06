const EventEmitter = require('events');
var Message = require("../models/message");
var Request = require("../models/request");

var winston = require('../config/winston');

class RequestEvent extends EventEmitter {
    constructor() {
        super();
        this.queueEnabled = false;
      }
}

const requestEvent = new RequestEvent();


requestEvent.on('request.create.simple', function(request) {


    // TODO setImmediate here?
    winston.debug('requestEvent here', request);

     // {path:'lead'}
     // ,{path:'participantsObj'}   //rror: error getting requestCast to ObjectId failed for value "bot_5cb82e4a25143b3a573c8701" at path "_id" for model "User" {"name":"CastError","stringValue":"\"bot_5cb82e4a25143b3a573c8701\"","kind":"ObjectId","value":"bot_5cb82e4a25143b3a573c8701"
    request
    // Request.findById(request.id)
        .populate(
            [           
            {path:'department'},
            {path:'lead'},
            {path:'participatingBots'},
            {path:'participatingAgents'},          
            // {path:'availableAgents'},                        
            {path:'requester',populate:{path:'id_user'}}
            ]
        ).execPopulate( function(err, requestComplete) {
        // ,function (err, requestComplete){

            if (err){
                winston.error('error getting request', err);
                return requestEvent.emit('request.create', request);
            }

            winston.debug('emitting request.create', requestComplete.toObject());

            requestEvent.emit('request.create', requestComplete);

            //with request.create no messages are sent. So don't load messages
        // Message.find({recipient:  request.request_id, id_project: request.id_project}).sort({updatedAt: 'asc'}).exec(function(err, messages) {                  
        //   if (err) {
        //         winston.error('err', err);
        //   }
        //   winston.debug('requestComplete',requestComplete.toObject());
        //   requestComplete.messages = messages;
        //   requestEvent.emit('request.create', requestComplete);

        // //   var requestJson = request.toJSON();
        // //   requestJson.messages = messages;
        // //   requestEvent.emit('request.create', requestJson);
        // });
    });
  });


module.exports = requestEvent;
