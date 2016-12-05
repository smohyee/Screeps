/**
 * Created by Sam on 12/3/2016.
 */
var spawn = {
    /**
     * @param {StructureSpawn} location
     **/
    engineer: function(location){
       var result = location.createCreep([WORK, WORK, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], null, {role: 'engineer', status: 'idle'});
        if(result > 0) console.log('Created creep. Name: ' + result + '; Role: engineer' );
    }

};

module.exports = spawn;