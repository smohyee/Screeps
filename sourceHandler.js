/**
 * Created by Sam on 12/3/2016.
 */
var sourceHandler = {

    determineSource: function(creep){



    },

    //returns current memory value of room, which tracks which energy source is next up for harvesting
    //value should switch for each worker redirected to the current queued source.
    checkRoomSourceQueue: function(room){

        return Game.getObjectById(room.memory.SourceQueueID);

    }



};

module.exports = sourceHandler;