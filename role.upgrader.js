/**
 * Created by Sam on 12/3/2016.
 */
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //If by the controller, upgrade till out of resources, then move toward source

        if(creep.upgradeController(creep.room.controller) == ERR_NOT_ENOUGH_RESOURCES){
            var sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(sources[0]);
        }
        //When no longer in range of controller, harvest source till at capacity
        else if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        //When carry capacity maxed, moved back to controller
        else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

    }
};

module.exports = roleUpgrader;

