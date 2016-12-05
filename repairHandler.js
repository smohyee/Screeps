/**
 * Created by Sam on 12/5/2016.
 *
 * Repairers
 */
var repairHandler = {

    repairers: [],
    repairSites: [],
    REPAIRER_COUNT: 5,


    run: function(location){
        this.repairSites = location.find(FIND_STRUCTURES, {filter: (o) => (o.hits < o.hitsMax)});

        this.repairers = location.find(FIND_MY_CREEPS, {
            filter: {memory: {role: 'repairer'}}
        })

        if(this.repairers.length < this.REPAIRER_COUNT) this.spawnRepairer(location);

        if(this.repairers.length > 0) this.runRepairers();

    },

    spawnRepairer: function(location){
        var spawns = location.find(FIND_MY_SPAWNS);

        if(spawns[0].canCreateCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK){
            var result = spawns[0].createCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], null, {role: 'repairer', status: 'idle'});
            console.log('Created creep. Name: ' + result + '; Role: repairer');
        }
    },

    runRepairers: function(){

        for(var i=0; i<this.reloaders.length; i++){
            var reloader = this.reloaders[i]

            if(reloader.memory.status == 'idle'){
                reloader.memory.destinationID = null;
                reloader.memory.status = this.determineStatus(reloader);
            }
            if(reloader.memory.status == 'reloading') this.reload(reloader);
            if(reloader.memory.status == 'repairing') this.repair(reloader);

        }

    },

    determineStatus: function(creep){
        //if out of energy, go reload
        if(creep.carry.energy == 0) return 'reloading';

        if(this.repairSites.length > 0) return 'repairing';

        return 'idle';

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


    reload: function(creep){
        var container;
        //assign creep a destination container if needed
        if(creep.memory.destinationID == null) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (o) => o.structureType == STRUCTURE_CONTAINER &&
                o.store[RESOURCE_ENERGY] > 100
        });
            //if no container with energy found, sit idle and wait
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
    }




};

module.exports = repairHandler;