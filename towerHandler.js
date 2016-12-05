/**
 * Created by Sam on 12/5/2016.
 */
var towerHandler = {
    towers: [],
    enemies: [],
    repairSites: [],


    run: function(location){
        this.towers = location.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        this.enemies = location.find(FIND_)
        this.repairSites = location.find(FIND_STRUCTURES, {filter: (o) => (o.hits < o.hitsMax)});

        for(var i=0; i<this.towers.length; i++){
            var tower = this.towers[i];

            if(this.repairSites.length > 0) this.repair(tower);
        }
    },

    repair: function(tower){
        this.repairSites.sort(function(a,b){return a.hits - b.hits});

        tower.repair(this.repairSites[0]);
    }
}

module.exports = towerHandler;