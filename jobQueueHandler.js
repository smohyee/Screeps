/**
 * Created by Sam on
 *
 *  jobQueueHandler contains a new paradigm for controlling screep actions. Rather than
 *  assigning similar
 *
 *  jobQueues are associative arrays stored in memory for each room I own
 *
 *  The contents of the jobQueue are a hash of targetIDs => jobs, where jobs are
 *   an object representing any task performable by another object in the game, such as creeps or towers.
 *
 *  job.type - repair, build, harvest, attack, etc
 *  job.status - unassigned, active, active - max (all worker slots filled), complete
 *  job.assignedCount - number of actors wanted for this job. 0 means unlimited
 *  job.assignedIDs - array of IDs of actors who are working on the job
 *
 *
 */
var jobQueueHandler = {

    jobQueue: {},

    run: function(location){

        if(typeof location.memory.jobQueue == 'undefined') location.memory.jobQueue = {},
        this.jobQueue = location.memory.jobQueue;

        this.collectJobs(location);
        if(Object.keys(location.memory.jobQueue).length > 0){
            this.prioritizeJobs(location);
            this.assignJobs(location);
        }
    },

    //check every potential target site and add to jobQueue memory (if it doesn't exist already)
    collectJobs: function(location){
        var site;
        var depositSites = location.find(FIND_MY_STRUCTURES, {
                    filter: (o) => ((o.structureType == STRUCTURE_EXTENSION ||
                                        o.structureType == STRUCTURE_SPAWN ||
                                        o.structureType == STRUCTURE_TOWER ||
                                        o.structureType == STRUCTURE_STORAGE) &&
                                        o.energy < o.energyCapacity)
        });
        var buildSites = location.find(FIND_MY_CONSTRUCTION_SITES);
        var repairSites = location.find(FIND_STRUCTURES, {filter: (o) => (o.hits < o.hitsMax)});


        for(var i=0; i<depositSites.length; i++){
            site = depositSites[i];
            if(typeof location.memory.jobQueue[site.id] == 'undefined'){

                location.memory.jobQueue[site.id] = {
                    type: 'deposit',
                    status: 'unassigned'
                }
            }
        }

        for(var i=0; i<buildSites.length; i++){
            site = buildSites[i];
            if(typeof location.memory.jobQueue[site.id] == 'undefined'){

                location.memory.jobQueue[site.id] = {
                    type: 'build',
                    status: 'unassigned'
                }
            }
        }

        for(var i=0; i<repairSites.length; i++){
            site = depositSites[i];
            if(typeof location.memory.jobQueue[site.id] == 'undefined'){

                location.memory.jobQueue[site.id] = {
                    type: 'repair',
                    status: 'unassigned'
                }
            }
        }

        if(typeof location.memory.jobQueue[location.controller.id] == 'undefined'){
            location.memory.jobQueue[location.controller.id] = {
                type: 'upgrade',
                status: 'unassigned',
                assignedCount: 0

            }
        }

    },

    prioritizeJobs: function(location){
        //Job priority is determined by position in Queue.

        //if Controller is about to downgrade, give max priority
        //else if Towers are at 0 energy, prioritize reload
        //
    },

    assignJobs: function(location){

    }





}

module.exports = jobQueueHandler;