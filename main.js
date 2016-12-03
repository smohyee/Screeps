var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var spawn = require('spawn');

module.exports.loop = function (){

    //clear memory storage for dead creeps
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    //check creep count in room and create as needed
    for(var name in Game.rooms){
        var room = Game.rooms[name];

        if(room.controller.my){
           var spawns = room.find(FIND_MY_SPAWNS);
           var harvesters = [];
           var upgraders = [];

           for(var creep in room.find(FIND_MY_CREEPS)){
               if(creep.spawning) continue;
               if(creep.memory.role == 'harvester') harvesters.push(creep);
               if(creep.memory.role == 'upgrader') upgraders.push(creep);
           }

           if(harvesters.length < 2) spawn.harvester(spawns[0]);
           if(upgraders.length < 5) spawn.upgrader(spawns[0]);
        }
    }

    for(var name in Game.creeps){
        //noinspection JSUnfilteredForInLoop
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester'){
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader'){
            roleUpgrader.run(creep);
        }
    }
}