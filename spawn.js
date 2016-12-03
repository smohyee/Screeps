/**
 * Created by Sam on 12/3/2016.
 */
var spawn = {

    /**
     * @param {StructureSpawn} location
     **/
    //
    harvester: function(location){
        location.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
    }

    /**
     * @param {StructureSpawn} location
     **/
    //
    upgrader: function(location){
        location.createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
    }

};

module.exports = spawn;