/**
 * Created by Sam on 12/3/2016.
 */
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var sources = creep.room.find(FIND_SOURCES);
        var controller = creep.room.controller;

        //If next to controller, attempt to upgrade
        if(creep.pos.isNearTo(controller)){
            //If out of resources, move away from controller
            if(creep.upgradeController(controller) == ERR_NOT_ENOUGH_RESOURCES){
                creep.moveTo(sources[0]);
            }
        }
        //If away from controller without full capacity, fill up
        else if(creep.carry.energy < creep.carryCapacity){
            if(creep.pos.isNearTo(sources[0])) creep.harvest(sources[]);
            else creep.moveTo(sources[0]);
        }
        //If away from controller with full capacity, move back to capacity
        else if(creep.carry.energy == creep.carryCapacity){
            creep.moveTo(controller);
        }

    }
};

module.exports = roleUpgrader;

