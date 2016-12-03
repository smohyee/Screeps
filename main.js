var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var spawn = require('spawn');

module.exports.loop = function () {

    for(var name in Game.rooms){
        var room = Game.rooms[name];

        if(room.controller.my){
           var spawns = room.find(FIND_MY_SPAWNS);

           var harvesters =  room.find(FIND_MY_CREEPS, {filter: function(object){return object.memory.role == 'harvester'}});
           if(harvesters.size < 2) spawn.harvester(spawns[0])

            var upgraders =  room.find(FIND_MY_CREEPS, {filter: function(object){return object.memory.role == 'upgrader'}});
            if(upgraders.size < 5) spawn.harvester(spawns[0])
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