/**
 * Created by Sam on 12/3/2016.
 */
var spawn = {

    var result;

    /**
     * @param {StructureSpawn} location
     **/
    //
    harvester: function(location){
        result = location.createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
        if(result > 0) console.log('Created creep. Name: ' + result + '; Role: harvester' );
    },

    /**
     * @param {StructureSpawn} location
     **/
    //
    upgrader: function(location){
        location.createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
        if(result > 0) console.log('Created creep. Name: ' + result + '; Role: upgrader' );
    }

};

module.exports = spawn;