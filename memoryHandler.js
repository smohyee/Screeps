/**
 * Created by Sam on 12/4/2016.
 */

//Define memory property for container structures
Object.defineProperty(StructureContainer.prototype, 'memory', {
    enumerable: true,
    configurable: false,
    get: function() {
        if(_.isUndefined(Memory.containers)) {
            Memory.containers = {};
        }
        if(!_.isObject(Memory.containers)) {
            return undefined;
        }
        return Memory.containers[this.id] = Memory.containers[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.containers)) {
            Memory.containers = {};
        }
        if(!_.isObject(Memory.containers)) {
            throw new Error('Could not set container memory');
        }
        Memory.containers[this.id] = value;
    }
});



var memoryHandler = {

    run: function(){
         //clear memory storage for dead creeps
        for(var i in Memory.creeps) {
            creep = Game.creeps[i];

            if(!creep) {
                delete Memory.creeps[i];
            }
            else if(creep.memory.status == null) creep.memory.status = 'idle';
        }

        for(var i in Memory.containers){
            if(Game.getObjectById(i) = null) delete Memory.containers[i];
        }

    },

};


module.exports = memoryHandler;