/**
 * Created by Sam on 12/3/2016.
 */
/*
Engineer role is meant to replace harvesters and upgraders.
A single unit that harvests, builds, and upgrades the controller.
 */
var roleEngineer = {

    depositSites: [],
    buildSites: [],
    repairSites: [],

    run: function(creep){

        this.depositSites = this.getDepositSites(creep);
        this.buildSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        this.repairSites = this.getRepairSites(creep);

        if(creep.memory.status == 'idle'){
            creep.memory.destinationID = null;
            creep.memory.status = this.determineStatus(creep);
        }
        if(creep.memory.status == 'harvesting') this.harvest(creep);
        if(creep.memory.status == 'depositing') this.depositEnergy(creep);
        if(creep.memory.status == 'building') this.construct(creep);
        if(creep.memory.status == 'repairing') this.repair(creep);
        if(creep.memory.status == 'upgrading controller') this.upgradeCtrl(creep);

    },

    determineStatus: function(creep){

        console.log(this.depositSites);

        //if out of energy, go harvest
        if(creep.carry.energy == 0) return 'harvesting';

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

        for(var i=0; i<sites.length; i++){
            if(sites[i].energy == sites[i].energyCapacity){
                sites.splice(i, 1);
            }
        }

        return sites;
    },

    getRepairSites: function(creep){
        var structures = creep.room.find(FIND_STRUCTURES);
        var repairSites = [];

        for(var i=0; i<structures.length; i++){
          if(structures[i].hits < structures[i].hitsMax) repairSites.push(structures[i]);
        }

        return repairSites;
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
            targetSite = creep.pos.findClosestByRange(this.depositSites);
            creep.memory.destinationID = targetSite.id;
        }
        else targetSite = Game.getObjectById(creep.memory.destinationID);

        if(creep.carry.energy == 0) creep.memory.status = 'idle';
        else if(creep.pos.isNearTo(targetSite)){
            if(creep.transfer(targetSite, RESOURCE_ENERGY) == ERR_FULL) creep.memory.status = 'idle';
        }
        else creep.moveTo(targetSite);
     },

    construct: function(creep){
        var targetSite;

        //if no building site has been assigned yet
        if(creep.memory.destinationID == null) {
            targetSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            creep.memory.destinationID = targetSite.id;
        }
        //Once construction is complete, construction site ID will be removed from game
        else if(Game.getObjectById(creep.memory.destinationID) == null){
            creep.memory.status = 'idle';
        }
        else{
            targetSite = Game.getObjectById(creep.memory.destinationID);
            if(creep.pos.inRangeTo(targetSite.pos, 3)){
                if(creep.build(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
            }
            else creep.moveTo(targetSite);
        }
    },

    repair: function(creep){
        var targetSite;

        if(creep.memory.destinationID == null) {
            targetSite = creep.pos.findClosestByRange(this.repairSites);
            creep.memory.destinationID = targetSite.id;
        }
        else{
            targetSite = Game.getObjectById(creep.memory.destinationID);
            if(targetSite.hits == targetSite.hitsMax){
                creep.memory.status = 'idle';
            }
            else if(creep.pos.inRangeTo(targetSite.pos, 3)){
                if(creep.repair(targetSite) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.status = 'idle';
            }
            else creep.moveTo(targetSite);
        }
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