/**
 * Created by Sam on 12/5/2016.
 */
var towerHandler = {
    towers: [],
    enemies: [],
    repairSites: [],
    mycreeps: [],


    run: function(location){
        this.towers = location.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        this.enemies = location.find(FIND_HOSTILE_CREEPS);
        this.repairSites = location.find(FIND_STRUCTURES, {filter: (o) => (o.hits < o.hitsMax)});


        for(var i=0; i<this.towers.length; i++) {
            var tower = this.towers[i];

            if (this.enemies.length > 0) this.attack(tower);
            else if (this.repairSites.length > 0 && tower.id != '584cb6e014f0ffe6607ad59b') this.repair(tower);
        }

    },

    repair: function(tower){
        this.repairSites.sort(function(a,b){return a.hits - b.hits});

        tower.repair(this.repairSites[0]);
    },

    attack: function(tower){
        tower.attack(this.enemies[0]);
    }

}

module.exports = towerHandler;