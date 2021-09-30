import { start, stop } from './controller';
import { HeroesSingleton } from './heroesSingleton';

/**
 * Initialize list of heroes to be selected
 */
var select = document.getElementById("heroesSelected");
var opt = null;
var heroesListJSON = HeroesSingleton.getHeroesListJSON();
for (var i = 0; i < heroesListJSON.length; i++) {
    var heroJSON = heroesListJSON[i];
    opt = document.createElement('option');
    opt.value = heroJSON.name;
    opt.innerHTML = heroJSON.name;
    if (select) select.appendChild(opt);
}

const theTable = document.getElementById("withsymbolsbeforesorting") as HTMLTableElement;
if (theTable) {
    console.log("Found withsymbolsbeforesorting");
    sorttable.makeSortable(theTable);
}

const myTH = document.getElementById("series-column") as HTMLTableCellElement;
if (myTH) {
    console.log("Found column: " + myTH.textContent);
    sorttable.innerSortFunction.apply(myTH, [myTH]);
}

/**
 * Set up controller options
 */
const startButton = document.getElementById('startSimulation');
if (startButton) startButton.onclick = start;
const stopButton = document.getElementById('stopSimulation');
if (stopButton) stopButton.onclick = stop;

console.log("App hooked the buttons to their functions.");
