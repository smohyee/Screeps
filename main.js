//MODULE DECLARATIONS
var roleEngineer = require('role.engineer');
var spawn = require('spawn');
var harvesterHandler = require('harvesterHandler');
var reloaderHandler = require('reloaderHandler');
var repairHandler = require('repairHandler');
var towerHandler = require('towerHandler');
var memoryHandler = require('memoryHandler');
var jobQueueHandler = require('JobQueueHandler');

//ADJUSTABLE PARAMETERS
var ENGINEER_COUNT = 5;

module.exports.loop = function (){

    var creep;
    var creepname;

    memoryHandler.run();

    //check creep count in room and create as needed
    for(var roomname in Game.rooms){
        var room = Game.rooms[roomname];

        if(room.controller.my){
            //run handlers in each room to handle behavior of different unit types
            harvesterHandler.run(room);
            reloaderHandler.run(room);
            repairHandler.run(room);
            towerHandler.run(room);

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