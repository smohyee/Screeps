/**
 * Created by Sam on 12/3/2016.
 */
/*
An Engineer is meant to serve as an all-purpose early game unit.

-Will harvest energy if no energy storage exists
-Will deposit, build, repair, upgrade as needed in a fixed order.
 */
var roleEngineer = {

    depositSites: [],
    buildSites: [],
    repairSites: [],

    run: function(creep){

        this.depositSites = this.getDepositSites(creep);
        this.buildSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        this.repairSites = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.hits<o.hitsMax)});

        if(creep.memory.status == 'idle'){
            creep.memory.destinationID = null;
            creep.memory.status = this.determineStatus(creep);
        }
        if(creep.memory.status == 'reloading') this.reload(creep);
        if(creep.memory.status == 'harvesting') this.harvest(creep);
        if(creep.memory.status == 'depositing') this.depositEnergy(creep);
        if(creep.memory.status == 'building') this.construct(creep);
        if(creep.memory.status == 'repairing') this.repair(creep);
        if(creep.memory.status == 'upgrading controller') this.upgradeCtrl(creep);

    },

    determineStatus: function(creep){
        //if out of energy, go harvest
        if(creep.carry.energy == 0) return 'reloading';

        //if controller is going to downgrade soon
        if(creep.room.controller.ticksToDowngrade < 1000) return 'upgrading controller';

        //if spawns need energy, go feed
        if(this.depositSites.length > 0) return 'depositing';

        //if there are construction sites, go build
        if(this.buildSites.length > 0) return 'building';

        //if there are structures needing repair, go repair
        if(this.repairSites.length > 0) return 'repairing';

        //otherwise, upgrade the controller
        if(creep.room.controller.my) return 'upgrading controller';
    },

    getDepositSites: function(creep){
        var sites = [];
        sites = sites.concat(creep.room.find(FIND_MY_SPAWNS));
        sites = sites.concat(creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}));
        var depSites = [];
        for(var i=0; i<sites.length; i++){
            if(sites[i].energy < sites[i].energyCapacity){
                depSites.push(sites[i]);
            }
        }

        return depSites;
    },

    reload: function(creep){
        var container;
        //assign creep a destination container if needed
        if(creep.memory.destinationID == null) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (o) = > o.structureType == STRUCTURE_CONTAINER &&
                o.store[RESOURCE_ENERGY] > 0
            });
            //if no container with energy found, go harvest directly from source
            if(container == null) creep.memory.status = 'harvesting';
            else creep.memory.destinationID = container.id;
        }
        else{
            container = Game.getObjectById(creep.memory.destinationID);
            //if creep is next to container, transfer till full, then go back to idle
            if(creep.pos.isNearTo(container)){
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_FULL) creep.memory.status = 'idle';
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

     depositEnergy: function(creep){
        var targetSite;

        if(creep.memory.destinationID == null){
            targetSite = creep.pos.findClosestByPath(this.depositSites);
            creep.memory.destinationID = targetSite.id;
        }
        else targetSite = Game.getObjectById(creep.memory.destinationID);

        if(targetSite.energy == targetSite.energyCapacity || creep.carry.energy == 0) creep.memory.status = 'idle';
        else if(creep.pos.isNearTo(targetSite)){
            if(creep.transfer(targetSite, RESOURCE_ENERGY) == ERR_FULL) creep.memory.status = 'idle';
        }
        else creep.moveTo(targetSite);
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
                creep.moveTo(targetSite);
            }
            else creep.moveTo(targetSite);
        }
    },

    repair: function(creep){
        var targetSite;

        if(creep.memory.destinationID == null) {
            targetSite = creep.pos.findClosestByPath(this.repairSites);
            creep.memory.destinationID = targetSite.id;
        }
        else{
            targetSite = Game.getObjectById(creep.memory.destinationID);
            if(targetSite.hits == targetSite.hitsMax){
                creep.memory.status = 'idle';
            }
            else if(creep.pos.getRangeTo(targetSite.pos) <= 3){
                if(creep.repair(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
            }
            else creep.moveTo(targetSite);
        }
    },

    upgradeCtrl: function(creep){
        var controller = creep.room.controller;

        if(creep.pos.getRangeTo(controller.pos) <= 3){
            if(creep.upgradeController(controller) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
            creep.moveTo(controller);
        }
        else creep.moveTo(controller);

    }


};




module.exports = roleEngineer;