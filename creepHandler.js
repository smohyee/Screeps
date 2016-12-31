/**
 * Created by Sam on 12/11/2016.
 *
 * Previously, each creep 'type' had its own module with its own defined methods. There was a lot of duplicated code that
 * was all separately maintained.
 *
 * Now, I've created jobQueueHandler, and the concept of jobs independent from creeps. Since any creep can be
 * assigned to any job (assuming it has the requisite body parts), it makes sense to define a set of universal actions
 * that would be performed by any creeps assigned jobs in the Job Queue.
 *
 * The plan is to eventually replace and remove all the individual creep modules, and have all creep types use the
 * methods in this handler.
 */

var creepHandler = {

    getEnergy

}

module.exports = creepHandler;