import { start, stop } from './controller';
import { HeroesSingleton } from './melee/heroesSingleton';

/**
 * Initialize list of heroes to be selected
 */
var select = document.getElementById("heroesSelected");
var opt = null;
var heroesListJSON = HeroesSingleton.getHeroesListJSON();
for (var i = 0; i < heroesListJSON.length; i++) {
    var heroJSON = heroesListJSON[i];
    opt = document.createElement('option');
    opt.value = heroJSON.id;
    opt.innerHTML = HeroesSingleton.getNameFromID(heroJSON.id);
    if (select) select.appendChild(opt);
}

/**
 * Set up controller options
 */
const startButton = document.getElementById('startSimulation');
if (startButton) startButton.onclick = start;
const stopButton = document.getElementById('stopSimulation');
if (stopButton) stopButton.onclick = stop;
