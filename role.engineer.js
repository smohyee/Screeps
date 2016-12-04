/**
 * Created by Sam on 12/3/2016.
 */
/*
Engineer role is meant to replace harvesters and upgraders.
A single unit that harvests, builds, and upgrades the controller.
 */
var roleEngineer = {

    spawns: null,

    run: function(creep){

        this.spawns = this.getSpawns(creep);

        if(creep.memory.status == 'idle') creep.memory.status = this.determineStatus(creep);
        if(creep.memory.status == 'harvesting') this.harvest(creep);
        if(creep.memory.status == 'feeding spawn') this.feedSpawn(creep);
        if(creep.memory.status == 'upgrading controller') this.upgradeCtrl(creep);

    },

    getSpawns : function(creep){
        return creep.room.find(FIND_MY_SPAWNS);
    },


    determineStatus: function(creep){
        //if out of energy, go harvest
        if(creep.carry.energy == 0) return 'harvesting';

        //if spawns need energy, go feed
        for(var i=0; i<this.spawns.length; i++){
            if(this.spawns[i].energy < this.spawns[i].energyCapacity){
                creep.memory.destinationID = this.spawns[i].id;
                return 'feeding spawn';
            }
        }

        //otherwise, upgrade the controller
        if(creep.room.controller.my) return 'upgrading controller';
    },

    harvest: function(creep){
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else creep.memory.status = 'idle';
    },

     feedSpawn: function(creep){

        var spawn = Game.getObjectById(creep.memory.destinationID);

        if(creep.energy == 0) creep.memory.status = 'idle';

        if(creep.pos.isNearTo(spawn)){
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_FULL) creep.memory.status = 'idle';
        }
        else creep.moveTo(spawn);
     },

    upgradeCtrl: function(creep){
        var controller = creep.room.controller;

        if(creep.pos.inRangeTo(controller, 3)){
            if(creep.upgradeController(controller) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
        }
        else creep.moveTo(controller);

    }


};




module.exports = roleEngineer;