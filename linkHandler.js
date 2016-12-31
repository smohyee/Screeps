/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('linkHandler');
 * mod.thing == 'a thing'; // true
 */

var linkHandler = {
    
    inputlinks: [],
    outputlinks: [],
    
    run: function(location){
        this.inputlinks = location.find(FIND_MY_STRUCTURES, {
            filter: (o) => o.structureType == STRUCTURE_LINK && o.memory.linkType == 'input' && o.energy > 400
        });
        this.outputlinks = location.find(FIND_MY_STRUCTURES, {
            filter: (o) => o.structureType == STRUCTURE_LINK && o.memory.linkType == 'output' && o.energy < 400
        });
        

        if(this.outputlinks.length > 0 && this.inputlinks.length > 0){
            this.inputlinks[0].transferEnergy(this.outputlinks[0]);
        }
        

    }
    
};

module.exports = linkHandler;