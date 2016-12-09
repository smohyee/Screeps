/**
 * Created by Sam on 12/4/2016.
 *
 * Reloaders pick up energy from containers and reload Spawns, extensions, and towers.
 * Objects that need energy transferred to them are known as deposit sites
 */
var reloaderHandler = {

    reloaders: [],
    depositSites: [],
    droppedResources: [],
    enemies: [],
    RELOADER_COUNT: 3,


    run: function(location){
        this.enemies = location.find(FIND_HOSTILE_CREEPS);

        this.depositSites = location.find(FIND_MY_STRUCTURES, {
                filter: (o) => ((o.structureType == STRUCTURE_EXTENSION ||
                                o.structureType == STRUCTURE_SPAWN) &&
                                o.energy < o.energyCapacity) ||
                                (o.structureType == STRUCTURE_TOWER &&
                                o.energy < o.energyCapacity - 200)
        });

        if(this.depositSites.length == 0) {
            this.depositSites = location.find(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_STORAGE}});
        }
        this.reloaders = location.find(FIND_MY_CREEPS, {
            filter: {memory: {role: 'reloader'}}
        });

        this.droppedResources = location.find(FIND_DROPPED_ENERGY);
        this.droppedResources.concat(location.find(FIND_DROPPED_RESOURCES));

        if(this.reloaders.length < this.RELOADER_COUNT) this.spawnReloader(location);

        if(this.reloaders.length > 0) this.runReloaders();

    },

    runReloaders: function(){

        for(var i=0; i<this.reloaders.length; i++){
            var reloader = this.reloaders[i]

            if(reloader.memory.status == 'idle'){
                reloader.memory.destinationID = null;
                reloader.memory.status = this.determineStatus(reloader);
            }
            if(reloader.memory.status == 'reloading') this.reload(reloader);
            if(reloader.memory.status == 'depositing') this.deposit(reloader);
            if(reloader.memory.status == 'pickup') this.pickup(reloader);

        }

    },

    determineStatus: function(creep){


        //if out of energy, go reload
        if(creep.carry.energy == 0){
            if(this.droppedResources.length > 0 && this.enemies.length == 0) return 'pickup';
            else return 'reloading';
        }

        //if spawns need energy, go feed
        if(this.depositSites.length > 0) return 'depositing';

        return 'idle';

    },

    deposit: function(reloader){
        var targetSite = reloader.pos.findClosestByPath(this.depositSites);

        if(reloader.carry.energy == 0) reloader.memory.status = 'idle';
        else if(targetSite != null) {
            //storage structure has diff properties for storing than
            if ((targetSite.structureType == STRUCTURE_STORAGE && _.sum(targetSite.store) < targetSite.storeCapacity) ||
                (targetSite.energy < targetSite.energyCapacity)) {
                if (reloader.pos.isNearTo(targetSite)) {
                    if (reloader.transfer(targetSite, RESOURCE_ENERGY) < 0) reloader.memory.status = 'idle';
                }
                else reloader.moveTo(targetSite);
            }

        }


    },
    //pick up energy from harvesting containers
    reload: function(creep){
        var containers = [];
        var container;
        //assign creep a destination container if needed
        if(creep.memory.destinationID == null) {
            containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (o) => o.structureType == STRUCTURE_CONTAINER &&
                    o.store[RESOURCE_ENERGY] > 0
                    });
            if(containers.length == 0) creep.memory.status = 'idle';
            else{
                //find the container with the most energy (containers[0])
                containers.sort(function(a,b){return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]});
                creep.memory.destinationID = containers[0].id;
            }
        }
        else{
            container = Game.getObjectById(creep.memory.destinationID);
            //if creep is next to container, transfer till full, then go back to idle
            if(creep.pos.isNearTo(container)){
                if(creep.withdraw(container, RESOURCE_ENERGY) < 0){
                    creep.memory.status = 'idle';
                }
            }
            else creep.moveTo(container);
        }
    },

    pickup: function(creep){
        //first withdraw from containers
        var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (o) => o.structureType == STRUCTURE_CONTAINER &&
                                                                                    o.store[RESOURCE_ENERGY] > 0});

        if(creep.withdraw(containers[0], RESOURCE_ENERGY) < 0){}
        if(this.droppedResources.length == 0) creep.memory.status = 'idle';
        else if(creep.pos.isNearTo(this.droppedResources[0].pos)){
            if(creep.pickup(this.droppedResources[0]) < 0){

            if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) creep.memory.status = 'idle';
            }
        }
        else creep.moveTo(this.droppedResources[0]);
    },

    //spawns idle reloaders as needed
    spawnReloader: function(location){
        var spawns = location.find(FIND_MY_SPAWNS);

        if(spawns[0].canCreateCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]) == OK){
            var result = spawns[0].createCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY], null, {role: 'reloader', status: 'idle'});
            console.log('Created creep. Name: ' + result + '; Role: reloader');
        }
    }


};

module.exports = reloaderHandler;