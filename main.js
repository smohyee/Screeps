var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var _ = require('lodash');

module.exports.loop = function () {

    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester'){
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader'){
            roleUpgrader.run(creep);
        }
    }
}