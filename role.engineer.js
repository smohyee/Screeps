/**
 * Created by Sam on 12/3/2016.
 */
/*
An Engineer is meant to serve as an all-purpose early game unit.

-Will harvest energy if no energy storage exists
-Will deposit, build, repair, upgrade as needed in a fixed order.
 */
var roleEngineer = {

    buildSites: [],

    run: function(creep){

        this.buildSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        //storing status in memory can only happen once per game tick - meaning it takes several ticks to go through the
        // action - idle - new action cycle. tempStatus bypasses memory when checking determineStatus
        var tempStatus = creep.memory.status;

        if(tempStatus == 'idle'){
            creep.memory.destinationID = null;
            tempStatus = this.determineStatus(creep);
            creep.memory.status = tempStatus;
        }
        if(tempStatus == 'reloading') this.reload(creep);
        if(tempStatus == 'harvesting') this.harvest(creep);
        if(tempStatus == 'building') this.construct(creep);
        if(tempStatus == 'upgrading controller') this.upgradeCtrl(creep);


    },

    determineStatus: function(creep){
        //if out of energy, go harvest
        if(creep.carry.energy == 0) return 'reloading';

        //if controller is going to downgrade soon
        if(creep.room.controller.ticksToDowngrade < 1000) return 'upgrading controller';

        //if there are construction sites, go build
        if(this.buildSites.length > 0) return 'building';

        //otherwise, upgrade the controller
        if(creep.room.controller.my) return 'upgrading controller';
    },


    reload: function(creep){
        var container;
        //assign creep a destination container if needed
        if(creep.memory.destinationID == null) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (o) => o.structureType == STRUCTURE_STORAGE &&
                                   o.store[RESOURCE_ENERGY] > 100
            });
            //if no container with energy found, go harvest directly from source
            if(container == null) creep.memory.status = 'harvesting';
            else creep.memory.destinationID = container.id;
        }
        else{
            container = Game.getObjectById(creep.memory.destinationID);
            //if creep is next to container, transfer till full, then go back to idle
            if(creep.pos.isNearTo(container)){
                if(creep.withdraw(container, RESOURCE_ENERGY) < 0) creep.memory.status = 'idle';
            }
            else creep.moveTo(container);
        }
    },

    harvest: function(creep){
        var source;
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.memory.destinationID == null){
                source = this.determineSource(creep);
                creep.memory.destinationID = source.id;
            }
            else source = Game.getObjectById(creep.memory.destinationID);

            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else creep.memory.status = 'idle';
    },

    determineSource: function(creep){
      var sources = creep.room.find(FIND_SOURCES);
      var i = creep.room.memory.targetSourceNumber;

      if(i == null || i >= sources.length) i = 0;

      creep.room.memory.targetSourceNumber = i + 1;

      return sources[i];
    },


    construct: function(creep){
        var targetSite;

        //if no building site has been assigned yet
        if(creep.memory.destinationID == null) {
            targetSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            creep.memory.destinationID = targetSite.id;
        }
        //Once construction is complete, construction site ID will be removed from game
        else if(Game.getObjectById(creep.memory.destinationID) == null){
            creep.memory.status = 'idle';
        }
        else{
            targetSite = Game.getObjectById(creep.memory.destinationID);
            if(creep.pos.getRangeTo(targetSite.pos) <= 3){
                if(creep.build(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
            }
            else creep.moveTo(targetSite);
        }
    },


    upgradeCtrl: function(creep){
        var controller = creep.room.controller;

        if(creep.pos.getRangeTo(controller.pos) <= 3){
            if(creep.upgradeController(controller) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
        }
        else creep.moveTo(controller);

    }


};




module.exports = roleEngineer;