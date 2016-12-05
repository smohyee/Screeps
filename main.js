//MODULE DECLARATIONS
var roleEngineer = require('role.engineer');
var spawn = require('spawn');
var harvesterHandler = require('harvesterHandler');

//ADJUSTABLE PARAMETERS
var ENGINEER_COUNT = 10;

module.exports.loop = function (){

    var creep;
    var creepname;

    //clear memory storage for dead creeps
    for(var i in Memory.creeps) {
        creep = Game.creeps[i];

        if(!creep) {
            delete Memory.creeps[i];
        }
        else if(creep.memory.status == null) creep.memory.status = 'idle';
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
        creep = Game.creeps[creepname];
        if(creep.memory.role == 'engineer'){
            roleEngineer.run(creep);
        }

    }
}