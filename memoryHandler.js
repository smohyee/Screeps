/**
 * Created by Sam on 12/4/2016.
 */





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
            if(Game.getObjectById(i) == null) delete Memory.containers[i];
        }

    },

};


module.exports = memoryHandler;