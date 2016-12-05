/**
 * Created by Sam on 12/4/2016.
 *
 * Reloaders pick up energy from containers and reload Spawns, extensions, and towers.
 * Objects that need energy transferred to them are known as deposit sites
 */
var reloaderHandler = {

    reloaders: [],
    depositSites: [],
    RELOADER_COUNT: 3,


    run: function(location){
        this.depositSites = location.find(FIND_MY_STRUCTURES, {
                filter: (o) => ((o.structureType == STRUCTURE_EXTENSION ||
                                    o.structureType == STRUCTURE_SPAWN ||
                                    o.structureType == STRUCTURE_TOWER) &&
                                    o.energy < o.energyCapacity)
        });

        this.reloaders = location.find(FIND_MY_CREEPS, {
            filter: {memory: {role: 'reloader'}}
        })

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

        }

    },

    determineStatus: function(creep){
        //if out of energy, go reload
        if(creep.carry.energy == 0) return 'reloading';

        //if spawns need energy, go feed
        if(this.depositSites.length > 0) return 'depositing';

        return 'idle';

    },

    deposit: function(reloader){
        var targetSite = reloader.pos.findClosestByPath(this.depositSites);

        if(targetSite != null){
            if(reloader.memory.status=='idle') reloader.memory.status = 'reloading';

            if(targetSite.energy == targetSite.energyCapacity || reloader.carry.energy == 0) reloader.memory.status = 'idle';
            else if(reloader.pos.isNearTo(targetSite)){
                if(reloader.transfer(targetSite, RESOURCE_ENERGY) < 0) reloader.memory.status = 'idle';
            }
            else reloader.moveTo(targetSite);
        }

    },

    reload: function(creep){
        var container;
        //assign creep a destination container if needed
        if(creep.memory.destinationID == null) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (o) => o.structureType == STRUCTURE_CONTAINER &&
                o.store[RESOURCE_ENERGY] > 0
        });
            //if no container with energy found, go harvest directly from source
            if(container == null) creep.memory.status = 'idle';
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

    //spawns idle reloaders as needed
    spawnReloader: function(location){
        var spawns = location.find(FIND_MY_SPAWNS);

        if(spawns[0].canCreateCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY]) == OK){
            var result = spawns[0].createCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY], null, {role: 'reloader', status: 'idle'});
            console.log('Created creep. Name: ' + result + '; Role: reloader');
        }
    }


};

module.exports = reloaderHandler;