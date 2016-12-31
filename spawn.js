/**
 * Created by Sam on 12/3/2016.
 */
var spawn = {
    /**
     * @param {StructureSpawn} location
     **/
    engineer: function(location){
        var result = location.createCreep([WORK, WORK, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], null, {role: 'engineer', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: engineer' );
    },
    
    attacker_melee: function(location){
        var result = location.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], null, {role: 'attacker_melee', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: attacker_melee' );
    },
    
    attacker_healer: function(location){
        var result = location.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], null, {role: 'attacker_healer', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: attacker_healer' );
    },
    
    attacker_melee_test: function(location){
        var result = location.createCreep([TOUGH,MOVE,ATTACK], null, {role: 'attacker_melee', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: attacker_melee' );
    },
    
    attacker_healer_test: function(location){
        var result = location.createCreep([TOUGH,MOVE,HEAL], null, {role: 'attacker_healer', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: attacker_healer' );
    },
    
    attacker_toughie: function(location){
        var result = location.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE], null, {role: 'attacker_toughie', status: 'idle'});
        if(!(result < 0)) console.log('Created creep. Name: ' + result + '; Role: attacker_toughie' );
    }

};

module.exports = spawn;