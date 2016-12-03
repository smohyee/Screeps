//MODULE DECLARATIONS
var roleEngineer = require('role.engineer');
var spawn = require('spawn');

//PARAMETER VARIABLES
var ENGINEER_COUNT = 20;





var creep;
var creepname;

module.exports.loop = function (){

    //clear memory storage for dead creeps
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    //check creep count in room and create as needed
    for(var roomname in Game.rooms){
        var room = Game.rooms[roomname];

        if(room.controller.my){
           var spawns = room.find(FIND_MY_SPAWNS);
           var engineers = [];

           var myRoomCreeps = room.find(FIND_MY_CREEPS);
           for(i in myRoomCreeps){
               creep = myRoomCreeps[i];
               if(creep.memory.role == 'engineer') engineers.push(creep);
           }

           if(engineers.length < ENGINEER_COUNT) spawn.engineer(spawns[0]);
        }
    }

    for(creepname in Game.creeps){
        //noinspection JSUnfilteredForInLoop
        creep = Game.creeps[creepname];
        if(creep.memory.role == 'engineer'){
            roleEngineer.run(creep);
        }

    }
}