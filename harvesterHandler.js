/**
 * Created by Sam on 12/4/2016.
 *
 * - Containers are built in available spots adjacent to Energy Sources
 * - Containers are added to memory, with property for harvester creep ID
 * - Each tick, creep IDs are checked. If a harvester creep is missing, assign an idle one
 * - Creeps sit on containers, harvesting and dropping into containers
 * - Number of harvester creeps is tied to number of energy adjacent containers
 */
var harvesterHandler = {

    harvestContainers: [],
    harvesters: [],

    //run all harvester related loops for a particular room.
    run: function(location){
        this.harvestContainers = this.getHarvestContainers(location);
        this.harvesters = location.find(FIND_MY_CREEPS, {filter: {memory: {role: 'harvester'}}}),

        //check if containers have a matching harvester
        this.checkContainers();
        //if room memory.spawnHarvester is set to 1, this method will spawn a single harvester and reset to 0
        this.spawnHarvester(location);

        this.runHarvesters();
    },

    getHarvestContainers: function(location){
        var containers = location.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
        var harvestContainers = [];

        for(var i=0; i<containers.length; i++){
            if(containers[i].pos.findInRange(FIND_SOURCES, 1).length > 0){
                harvestContainers.push(containers[i]);
            }
        }
        return harvestContainers;
    },


    //check harvest containers for matching harvester ID in memory.
    //returns array of containers that don't have a matching harvester
    checkContainers: function() {
        for(var i=0; i<this.harvestContainers.length; i++) {
            var container = this.harvestContainers[i];

            if(container.memory.harvesterID  == null) this.assignIdleHarvester(container);
            else if(Game.getObjectById(container.memory.harvesterID) == null){
                container.memory.harvesterID = null;
                this.assignIdleHarvester(container);
            }
        }
    },

    //spawns idle harvesters as needed by containers
    spawnHarvester: function(location){
        if(location.memory.spawnHarvester == 1){
            var spawns = location.find(FIND_MY_SPAWNS);
            var result = spawns[0].createCreep([WORK, WORK, MOVE, WORK, MOVE], null, {role: 'harvester', status: 'idle'});
            if(result > 0) {
                console.log('Created creep. Name: ' + result + '; Role: harvester');
                location.memory.spawnHarvester = 0;
            }
            else console.log('Error code spawning harvester: ' + result);
        }

    },

    //assigns idle harvesters to containers that don't have one, via memory
    assignIdleHarvester: function(container){
        var harvester = container.pos.findClosestByPath(FIND_MY_CREEPS, {filter: {memory: {role: 'harvester', status: 'idle'}}});
        //if no harvester is found, queue one up for spawn
        if(harvester == null) container.room.memory.spawnHarvester = 1;
        else{
            container.memory.harvesterID = harvester.id;
            harvester.memory.destinationID = container.id;
        }
    },

    runHarvesters: function(){

        for(var i=0; i<this.harvesters.length; i++){
            var harvester = this.harvesters[i];
            //if harvester is on destination, harvest
            if(harvester.pos.isEqualTo(Game.getObjectById(harvester.memory.destinationID))){
                var sources = harvester.pos.findInRange(FIND_SOURCES_ACTIVE, 1);
                if(sources.length > 0) harvester.harvest(sources[0]);
            }
            //if harvester is not on destination container, move
            else harvester.moveTo(Game.getObjectById(harvester.memory.destinationID));

        }

    }

};

module.exports = harvesterHandler;