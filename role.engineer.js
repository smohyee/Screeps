/**
 * Created by Sam on 12/3/2016.
 */
/*
Engineer role is meant to replace harvesters and upgraders.
A single unit that harvests, builds, and upgrades the controller.
 */
var roleEngineer = {

    spawns: [],
    buildsites: [],

    run: function(creep){

        this.spawns = creep.room.find(FIND_MY_SPAWNS);
        this.buildsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        if(creep.memory.status == 'idle'){
            creep.memory.destinationID = null;
            creep.memory.status = this.determineStatus(creep);
        }
        if(creep.memory.status == 'harvesting') this.harvest(creep);
        if(creep.memory.status == 'feeding spawn') this.feedSpawn(creep);
        if(creep.memory.status == 'building') this.construct(creep);
        if(creep.memory.status == 'upgrading controller') this.upgradeCtrl(creep);

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

        //if there are construction sites, go build
        if(this.buildsites.length > 0) return 'building';

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

        if(creep.carry.energy == 0) creep.memory.status = 'idle';

        if(creep.pos.isNearTo(spawn)){
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_FULL) creep.memory.status = 'idle';
        }
        else creep.moveTo(spawn);
     },

    construct: function(creep){
        var targetSite;

        if(creep.memory.destinationID == null){
            targetSite = creep.pos.findClosestByPath(this.buildsites);
            creep.memory.destinationID = targetSite.id;
        }
        else targetSite = Game.getObjectById(creep.memory.destinationID);

        if(creep.pos.inRangeTo(targetSite, 3)){
            if(creep.build(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
        }
        else creep.moveTo(targetSite);

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