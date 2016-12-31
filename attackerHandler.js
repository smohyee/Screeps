

var attackerHandler = {
    
    attackFlags: [], 
    
    run: function(creep){
        var tempStatus = creep.memory.status;
        
        tempStatus = this.determineStatus(creep);
        creep.memory.status = tempStatus;
        
        if(tempStatus == 'attacking') this.attack(creep);
        if(tempStatus == 'rallying') this.rally(creep);
        if(tempStatus == 'healing') this.heal(creep);
        if(tempStatus == 'draining') this.drain(creep);
        if(tempStatus == 'idle'){}
        
    },
    
    determineStatus: function(creep){
        if(Memory.attackStatus == 'Rally') return 'rallying';
        else if(Memory.attackStatus == 'Attack'){
            if(creep.memory.role == 'attacker_melee') return 'attacking';
            else if(creep.memory.role == 'attacker_healer') return 'healing';
        }
        else if(Memory.attackStatus == 'Drain'){
            if(creep.memory.role == 'attacker_toughie') return 'draining';
            else if(creep.memory.role == 'attacker_healer') return 'healing';
            else if(creep.memory.role == 'atatcker_melee') return 'rallying';
            
        }
        if(Memory.attackStatus == 'idle') return 'idle';
        
        console.log(creep.name + creep.memory.status);
        
    },
    
    //attack targets are based on flag placement
    //flags are labeled 'Attack1', 'Attack2', etc, and targets are attacked in order by all attack creeps.
    //however, while enemy creep are in range they are prioritized instead
    attack: function(creep){
        
        var attackFlags = [];
        var target;
        var nearbyHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);

        
        if(nearbyHostiles.length > 0) creep.attack(nearbyHostiles[0]);
        else if(creep.memory.destinationID == null){
            for(flag in Game.flags){
                if(flag.startsWith('Attack')){
                    var i = flag[6];
                    attackFlags[i] = Game.flags[flag];
                }
            }

            for(i=0; i<attackFlags.length; i++){
                if(attackFlags[i] != null){
                    var flag = attackFlags[i];
                    
                    if(flag.pos.roomName != creep.pos.roomName) creep.moveTo(flag);
                    else{
                        var targetStructures = flag.pos.lookFor(LOOK_STRUCTURES);
                        if(targetStructures.length > 0){
                            target = targetStructures[0];
                            break;
                        }
                        
                    }
                }
            }
            
            if(target != null) creep.memory.destinationID = target.id;
        }
        else{
            target = Game.getObjectById(creep.memory.destinationID);
            
            if(target == null) creep.memory.destinationID = null;
            
            if(creep.pos.isNearTo(target)) creep.attack(target);
            else creep.moveTo(target);
            
        }
        
    },
    
    
    //currently support a single rally point, at flag labeled 'Rally'
    //attack creeps will gather here upon spawn before attacking
    //and will return here when retreating
    rally: function(creep){
        var rallyPoint = Game.flags.Rally.pos;
        
        creep.moveTo(rallyPoint);
    },
    
    //creeps on 'heal' status find the closest damaged attack creep and move to them and heal. 
    heal: function(creep){
        var healTarget = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (o) => o.hits < o.hitsMax});
        var targetCreep;
        
        if(healTarget != null) targetCreep = healTarget;
        //if no targets need healing just follow the neareset attack creep
        else targetCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (o) => o.memory.role == 'attacker_melee'});
        
        if(targetCreep != null){
            if(!creep.pos.isNearTo(targetCreep)) creep.moveTo(targetCreep);
            creep.heal(targetCreep);
        }
    
    },
    
    //drain as in 'energy drain' - tough creep goes into room, absorbs tower damage, comes back for heals, repeats.
    drain: function(creep){
        
        if(creep.hits < creep.hitsMax) creep.moveTo(Game.flags.Rally);
        else creep.moveTo(Game.flags.Attack1);
        
    }
    
};

module.exports = attackerHandler;