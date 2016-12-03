var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var spawn = require('spawn');
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
           var harvesters = [];
           var upgraders = [];

           var myRoomCreeps = room.find(FIND_MY_CREEPS);
           for(i in myRoomCreeps){
               creep = myRoomCreeps[i];
               if(creep.memory.role == 'harvester') harvesters.push(creep);
               if(creep.memory.role == 'upgrader') upgraders.push(creep);
           }

           if(harvesters.length < 2) spawn.harvester(spawns[0]);
           if(upgraders.length < 5) spawn.upgrader(spawns[0]);
        }
    }

    for(creepname in Game.creeps){
        //noinspection JSUnfilteredForInLoop
        creep = Game.creeps[creepname];
        if(creep.memory.role == 'harvester'){
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader'){
            roleUpgrader.run(creep);
        }
    }
}