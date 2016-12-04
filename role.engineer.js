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
            var source = this.determineSource(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else creep.memory.status = 'idle';
    },

    determineSource: function(creep){
      var sources = creep.room.find(FIND_SOURCES);
      var i;

      if(creep.room.memory.targetSourceNumber == null) i = 0;
      if(creep.room.memory.targetSourceNumber >= sources.length) i = 0;
      else{
          i = creep.room.memory.targetSourceNumber;
          creep.room.memory.targetSourceNumber = i + 1;
      }

      return sources[i];
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
            targetSite = creep.pos.findClosestByRange(this.buildsites);
            creep.memory.destinationID = targetSite.id;
        }
        else targetSite = Game.getObjectById(creep.memory.destinationID);

        if(creep.pos.inRangeTo(targetSite.pos, 3)){
            if(creep.build(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
        }
        else creep.moveTo(targetSite);

    },

    upgradeCtrl: function(creep){
        var controller = creep.room.controller;

        if(creep.pos.inRangeTo(controller.pos, 3)){
            if(creep.upgradeController(controller) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
        }
        else creep.moveTo(controller);

    }


};




module.exports = roleEngineer;