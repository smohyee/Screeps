//MODULE DECLARATIONS
var roleEngineer = require('role.engineer');
var spawn = require('spawn');
var harvesterHandler = require('harvesterHandler');
var reloaderHandler = require('reloaderHandler');
var repairHandler = require('repairHandler');
var towerHandler = require('towerHandler');
var memoryHandler = require('memoryHandler');
var jobQueueHandler = require('jobQueueHandler');
var linkHandler = require('linkHandler');
var attackerHandler = require('attackerHandler');

//ADJUSTABLE PARAMETERS
var ENGINEER_COUNT = 2;
var MELEE_COUNT = 0;
var HEALER_COUNT = 0;
var TOUGHIE_COUNT = 0;

//CUSTOM OBJECT PROPERTIES

//defines memory property for containers
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

//defines memory property for links
Object.defineProperty(StructureLink.prototype, 'memory', {
    enumerable: true,
    configurable: false,
    get: function() {
        if(_.isUndefined(Memory.links)) {
            Memory.links = {};
        }
        if(!_.isObject(Memory.links)) {
            return undefined;
        }
        return Memory.links[this.id] = Memory.links[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.links)) {
            Memory.links = {};
        }
        if(!_.isObject(Memory.links)) {
            throw new Error('Could not set link memory');
        }
        Memory.links[this.id] = value;
    }
});

module.exports.loop = function (){
    var creep;
    var creepname;

    memoryHandler.run();

    //check creep count in room and create as needed
    for(var roomname in Game.rooms){
        var room = Game.rooms[roomname];


        if(room.controller.my){
            //run handlers in each room to handle behavior of different unit types
            harvesterHandler.run(room);
            reloaderHandler.run(room);
            repairHandler.run(room);
            towerHandler.run(room);
            linkHandler.run(room);

            var spawns = room.find(FIND_MY_SPAWNS);
            var engineers = [];
            var melees = [];
            var healers = [];
            var toughies = [];

            var myRoomCreeps = room.find(FIND_MY_CREEPS);
            for(i in myRoomCreeps){
                creep = myRoomCreeps[i];
                if(creep.memory.role == 'engineer') engineers.push(creep);
                else if(creep.memory.role == 'attacker_melee') melees.push(creep);
                else if(creep.memory.role == 'attacker_healer') healers.push(creep);
                else if(creep.memory.role == 'attacker_toughie') toughies.push(creep);
            }

            if(engineers.length < ENGINEER_COUNT) spawn.engineer(spawns[0]);
            else if(melees.length < MELEE_COUNT) spawn.attacker_melee(spawns[0]);
            else if(healers.length < HEALER_COUNT) spawn.attacker_healer(spawns[0]);
            else if(toughies.length < TOUGHIE_COUNT) spawn.attacker_toughie(spawns[0]);
        }
    }

    for(creepname in Game.creeps){
        creep = Game.creeps[creepname];
        if(creep.memory.role == 'engineer'){
            roleEngineer.run(creep);
        }
        else if(creep.memory.role.startsWith('attacker')){
            attackerHandler.run(creep);
        }

    }
    
    
}