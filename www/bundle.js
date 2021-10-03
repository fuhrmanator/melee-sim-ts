/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller.ts":
/*!***************************!*\
  !*** ./src/controller.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stop = exports.start = void 0;
var worker_1 = __webpack_require__(/*! worker-loader!./worker/worker */ "./node_modules/worker-loader/dist/cjs.js!./src/worker/worker.ts");
var isPoleWeaponsChargeFirstRoundChecked = false;
var isDefendVsPoleChargeChecked = false;
var isVerboseChecked = false;
var primeWorker = new worker_1.default();
// http://stackoverflow.com/a/5867262/1168342
function getSelectedValues(selectElement) {
    var result = [];
    var options = selectElement && selectElement.options;
    var opt;
    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];
        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}
function clearDiv(id) {
    var div = document.getElementById(id);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
function start(_ev) {
    isPoleWeaponsChargeFirstRoundChecked = document.getElementById("poleWeaponsChargeFirstRound").checked;
    isDefendVsPoleChargeChecked = document.getElementById("defendVsPoleCharge").checked;
    isVerboseChecked = document.getElementById("verboseOutput").checked;
    // 'this' is the button that was clicked (onclick)
    var startButton = this;
    startButton.disabled = true;
    var stopButton = document.getElementById("stopSimulation");
    stopButton.disabled = false;
    var progressBar = document.getElementById("progress");
    if (progressBar) {
        progressBar.style.width = 0 + "%";
        progressBar.style.transition = "none"; // don't use bootstrap animation of progress bar
        //progressBar.classList.add("active"); // turn on animated striped bar
        progressBar.classList.add("progress-bar-animated"); // turn on animated striped bar
    }
    var verboseOutputText = document.getElementById("verboseOutputText");
    verboseOutputText.value = "";
    /**
     * Clear results from previous run
     */
    clearDiv("heroWins");
    clearDiv("matchupWins");
    //console.log('Starting simulation');
    var hw = document.getElementById("heroWins");
    var mw = document.getElementById("matchupWins");
    var logBuffer = "";
    if (hw && mw && progressBar) {
        primeWorker.onmessage = function (event) {
            var data = event.data;
            //console.log("Web worker messaged me: " + event.data);
            switch (data.cmd) {
                case 'log':
                    logBuffer += data.message + "\n";
                    break;
                case 'progressUpdate':
                    //progressBar.value = data.progress;
                    var progress = Math.round(data.progress / 100);
                    var label = progress + "%";
                    if (progressBar) {
                        progressBar.style.width = label;
                        if (progress < 100) {
                            progressBar.innerText = label;
                        }
                        else {
                            progressBar.innerText = "Creating final results...";
                        }
                    }
                    break;
                case 'finished':
                    if (progressBar) {
                        progressBar.style.width = "100%";
                        progressBar.innerText = "See results below.";
                        progressBar.classList.remove("progress-bar-animated"); // stop animated striped bar
                    }
                    //console.log(`Finished: received ${data.heroWins}`);
                    /**
                     * Clear messages
                     */
                    clearDiv("heroWins");
                    clearDiv("matchupWins");
                    var heroWinsTable = document.createElement("table");
                    heroWinsTable.style.width = "100%";
                    heroWinsTable.className = "sortable table table-striped table-condensed caption-top";
                    hw.appendChild(heroWinsTable);
                    heroWinsTable.innerHTML = data.heroWinsTableHTML;
                    sorttable.makeSortable(heroWinsTable);
                    var matchupWinsTable = document.createElement("table");
                    matchupWinsTable.style.width = "100%";
                    matchupWinsTable.className = "sortable table table-striped table-condensed caption-top";
                    matchupWinsTable.innerHTML = data.matchupWinsTableHTML;
                    mw.appendChild(matchupWinsTable);
                    sorttable.makeSortable(matchupWinsTable);
                    /**
                     * Force tables to be sorted
                     */
                    var myTH = document.getElementById("matchwins");
                    if (myTH) {
                        sorttable.innerSortFunction.apply(myTH, [myTH]); // once for ascending
                        sorttable.innerSortFunction.apply(myTH, [myTH]); // again for descending (stupid but it's how it works)
                    }
                    myTH = document.getElementById("wins"); // top table last, since the icon only shows on last table sorted...
                    if (myTH) {
                        sorttable.innerSortFunction.apply(myTH, [myTH]); // once for ascending
                        sorttable.innerSortFunction.apply(myTH, [myTH]); // again for descending (stupid but it's how it works)
                    }
                    console.log("Log:\n" + logBuffer);
                    verboseOutputText.value = logBuffer;
                    startButton.disabled = false;
                    stopButton.disabled = true;
                    break;
                default:
                    console.log("Unrecognized message from web worker: ");
                    console.log(data);
                    break;
            }
        };
        primeWorker.onerror = function () {
            console.log("WORKER ERROR", arguments);
        };
        // Message the worker to do the simulation
        var boutCount = parseInt(document.getElementById("boutsPerMatchup").value);
        var selectElement = document.getElementById("heroesSelected");
        var selectedHeroes = getSelectedValues(selectElement);
        // give worker the info
        primeWorker.postMessage({ 'cmd': 'do simulation', 'selectedHeroes': selectedHeroes, 'boutCount': boutCount, 'isPoleWeaponsChargeFirstRound': isPoleWeaponsChargeFirstRoundChecked, 'isDefendVsPoleCharge': isDefendVsPoleChargeChecked, 'isVerbose': isVerboseChecked });
        var p = document.createElement('p');
        p.className = "bg-info";
        p.appendChild(document.createTextNode("Calculating results - please wait."));
        mw.appendChild(p);
        p = document.createElement('p');
        p.className = "bg-info";
        p.appendChild(document.createTextNode("Calculating results - please wait."));
        hw.appendChild(p);
    }
    else {
        console.log("couldn't find heroWins or matchupWins or progress bar element on page!");
    }
}
exports.start = start;
function stop(_ev) {
    /**
     * Stop the web worker
     */
    var stopButton = this;
    stopButton.disabled = true;
    primeWorker.terminate();
    primeWorker = new worker_1.default();
    var progressBar = document.getElementById("progress");
    if (progressBar)
        progressBar.classList.remove("progress-bar-animated"); // stop animated striped bar
    var mw = document.getElementById("matchupWins");
    var hw = document.getElementById("heroWins");
    /**
     * Clear results from previous run
     */
    clearDiv("heroWins");
    clearDiv("matchupWins");
    var p = document.createElement('p');
    p.className = "bg-warning";
    p.appendChild(document.createTextNode("No results because the simulator was stopped before it finished."));
    if (mw)
        mw.appendChild(p);
    p = document.createElement('p');
    p.className = "bg-warning";
    p.appendChild(document.createTextNode("No results because the simulator was stopped before it finished."));
    if (hw)
        hw.appendChild(p);
    document.getElementById("startSimulation").disabled = false;
}
exports.stop = stop;
;


/***/ }),

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setMute = exports.log = void 0;
var isMute = false;
function log(message) {
    // if (!isMute) console.log(message);
    if (!isMute)
        postMessage({ "cmd": "log", "message": message });
}
exports.log = log;
function setMute(changeIsMute) {
    isMute = changeIsMute;
}
exports.setMute = setMute;


/***/ }),

/***/ "./src/melee/armor.ts":
/*!****************************!*\
  !*** ./src/melee/armor.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Armor = void 0;
var Armor = /** @class */ (function () {
    function Armor(name, hitsStopped, maAdj, dxAdj) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.maAdj = maAdj;
        this.dxAdj = dxAdj;
    }
    Armor.NO_ARMOR = new Armor("No armor", 0, 0, 0);
    Armor.LEATHER = new Armor("Leather", 2, 2, 2);
    Armor.CHAIN = new Armor("Chain", 3, 4, 4);
    Armor.PLATE = new Armor("Plate", 5, 6, 6);
    return Armor;
}());
exports.Armor = Armor;


/***/ }),

/***/ "./src/melee/die.ts":
/*!**************************!*\
  !*** ./src/melee/die.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rollFourDice = exports.rollThreeDice = exports.rollDice = exports.roll = void 0;
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
function roll() {
    var roll = Math.floor(Math.random() * 6 + 1);
    (0, logger_1.log)("Die roll: " + roll);
    return roll;
}
exports.roll = roll;
function rollDice(numDice) {
    var result = 0;
    for (var i = 0; i < numDice; i++) {
        result += roll();
    }
    return result;
}
exports.rollDice = rollDice;
function rollThreeDice() {
    return rollDice(3);
}
exports.rollThreeDice = rollThreeDice;
function rollFourDice() {
    return rollDice(4);
}
exports.rollFourDice = rollFourDice;


/***/ }),

/***/ "./src/melee/heroesSingleton.ts":
/*!**************************************!*\
  !*** ./src/melee/heroesSingleton.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeroesSingleton = void 0;
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
var armor_1 = __webpack_require__(/*! ./armor */ "./src/melee/armor.ts");
var shield_1 = __webpack_require__(/*! ./shield */ "./src/melee/shield.ts");
var HeroesSingleton = /** @class */ (function () {
    function HeroesSingleton() {
    }
    HeroesSingleton.getHeroesListJSON = function () {
        return HeroesSingleton.heroesListJSON;
    };
    ;
    HeroesSingleton.getListHeight = function () {
        return HeroesSingleton.listHeight;
    };
    ;
    HeroesSingleton.getNameFromID = function (id) {
        var hero = this.heroesListJSON.find(function (hero) { return hero.id == id; });
        var name = hero ? (hero.id + ":ST" + hero.st + ";DX" + hero.dx + ";" + hero.weapon.name + ";" + hero.armor.name + ";" + hero.shield.name).toUpperCase().replace(/[ -]/g, '_') : "(hero id " + id + " not found)";
        return name;
    };
    // http://stackoverflow.com/a/9753841/1168342
    HeroesSingleton.listHeight = 15;
    HeroesSingleton.heroesListJSON = [
        { "id": "001", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "002", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "003", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "004", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "005", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "006", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "007", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "008", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "009", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "010", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "011", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "012", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "013", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "014", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "015", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "016", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "017", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "018", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "019", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "020", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "021", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "022", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "023", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "024", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "025", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "026", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "027", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "028", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "029", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "030", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "031", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "032", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "033", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "034", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "035", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "036", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "037", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "038", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "039", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "040", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "041", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "042", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "043", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "044", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "045", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "046", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "047", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "048", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "049", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "050", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "051", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "052", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "053", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "054", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "055", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "056", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "057", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "058", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "059", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "060", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "061", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "062", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "063", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "064", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "065", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "066", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "067", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "068", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "069", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "070", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "071", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "072", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "073", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "074", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "075", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "076", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "077", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "078", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "079", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "080", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "081", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "082", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "083", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "084", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "085", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "086", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "087", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "088", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "089", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "090", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "091", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "092", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "093", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "094", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "095", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "096", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "097", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "098", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "099", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "100", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "101", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "102", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "103", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "104", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "105", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "106", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "107", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "108", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD }
    ];
    return HeroesSingleton;
}());
exports.HeroesSingleton = HeroesSingleton;


/***/ }),

/***/ "./src/melee/shield.ts":
/*!*****************************!*\
  !*** ./src/melee/shield.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shield = void 0;
var Shield = /** @class */ (function () {
    function Shield(name, hitsStopped, dxAdj) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.dxAdj = dxAdj;
    }
    Shield.NO_SHIELD = new Shield("No shield", 0, 0);
    Shield.SMALL_SHIELD = new Shield("Small shield", 1, 0);
    Shield.LARGE_SHIELD = new Shield("Large shield", 2, 1);
    return Shield;
}());
exports.Shield = Shield;


/***/ }),

/***/ "./src/melee/weapon.ts":
/*!*****************************!*\
  !*** ./src/melee/weapon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Weapon = void 0;
var die_1 = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var Weapon = /** @class */ (function () {
    function Weapon(name, st, dice, modifier, isTwoHanded, isThrown, isPole) {
        this.name = name;
        this.st = st;
        this.dice = dice;
        this.modifier = modifier;
        this.isTwoHanded = isTwoHanded;
        this.isPole = isPole;
        this.isThrown = isThrown;
    }
    Weapon.prototype.doDamage = function () {
        (0, logger_1.log)("Rolling for weapon doing "
            + this.dice
            + "d"
            + ((this.modifier > 0) ? "+" : "")
            + ((this.modifier !== 0) ? this.modifier : "")
            + " damage.");
        var damage = 0;
        damage += (0, die_1.rollDice)(this.dice);
        damage += this.modifier;
        if (this.modifier !== 0)
            (0, logger_1.log)(((this.modifier > 0) ? "+" : "") + this.modifier);
        if (damage < 0)
            damage = 0;
        (0, logger_1.log)("Total weapon damage: " + damage);
        return damage;
    };
    ;
    Weapon.prototype.toString = function () {
        return this.name + " (" + this.dice + "D" + ((this.modifier > 0) ? "+" : "") + ((this.modifier !== 0) ? this.modifier : "") + ")";
    };
    ;
    Weapon.NONE = new Weapon("None", 0, 0, 0, false, false, false);
    Weapon.DAGGER = new Weapon("Dagger", 0, 1, -1, true, false, false);
    Weapon.RAPIER = new Weapon("Rapier", 9, 1, 0, false, false, false);
    Weapon.CLUB = new Weapon("Club", 9, 1, 0, true, false, false);
    Weapon.HAMMER = new Weapon("Hammer", 10, 1, 1, true, false, false);
    Weapon.CUTLASS = new Weapon("Cutlass", 10, 2, -2, false, false, false);
    Weapon.SHORTSWORD = new Weapon("Shortsword", 11, 2, -1, false, false, false);
    Weapon.MACE = new Weapon("Mace", 11, 2, -1, true, false, false);
    Weapon.SMALL_AX = new Weapon("Small ax", 11, 1, 2, true, false, false);
    Weapon.BROADSWORD = new Weapon("Broadsword", 12, 2, 0, false, false, false);
    Weapon.MORNINGSTAR = new Weapon("Morningstar", 13, 2, 1, false, false, false);
    Weapon.TWO_HANDED_SWORD = new Weapon("Two-handed sword", 14, 3, -1, false, true, false);
    Weapon.BATTLEAXE = new Weapon("Battleaxe", 15, 3, 0, false, true, false);
    // pole weapons
    Weapon.JAVELIN = new Weapon("Javelin", 9, 1, -1, true, false, true);
    Weapon.SPEAR = new Weapon("Spear", 11, 1, 1, true, true, true);
    Weapon.HALBERD = new Weapon("Halberd", 13, 2, -1, false, true, true);
    Weapon.PIKE_AXE = new Weapon("Pike axe", 15, 2, 2, false, true, true); // And now return the constructor function
    return Weapon;
}());
exports.Weapon = Weapon;


/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js!./src/worker/worker.ts":
/*!***********************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./src/worker/worker.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Worker_fn)
/* harmony export */ });
function Worker_fn() {
  return new Worker(__webpack_require__.p + "bundle.worker.js");
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "./";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var controller_1 = __webpack_require__(/*! ./controller */ "./src/controller.ts");
var heroesSingleton_1 = __webpack_require__(/*! ./melee/heroesSingleton */ "./src/melee/heroesSingleton.ts");
/**
 * Initialize list of heroes to be selected
 */
var select = document.getElementById("heroesSelected");
var opt = null;
var heroesListJSON = heroesSingleton_1.HeroesSingleton.getHeroesListJSON();
for (var i = 0; i < heroesListJSON.length; i++) {
    var heroJSON = heroesListJSON[i];
    opt = document.createElement('option');
    opt.value = heroJSON.id;
    opt.innerHTML = heroesSingleton_1.HeroesSingleton.getNameFromID(heroJSON.id);
    if (select)
        select.appendChild(opt);
}
/**
 * Set up controller options
 */
var startButton = document.getElementById('startSimulation');
if (startButton)
    startButton.onclick = controller_1.start;
var stopButton = document.getElementById('stopSimulation');
if (stopButton)
    stopButton.onclick = controller_1.stop;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVB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SSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN2SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxh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LElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFP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QUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLElBQUksY0FBYyxHQUFHLGlDQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM1QyxJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsaUNBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELElBQUksTUFBTTtRQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDdkM7QUFFRDs7R0FFRztBQUNILElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvRCxJQUFJLFdBQVc7SUFBRSxXQUFXLENBQUMsT0FBTyxHQUFHLGtCQUFLLENBQUM7QUFDN0MsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzdELElBQUksVUFBVTtJQUFFLFVBQVUsQ0FBQyxPQUFPLEdBQUcsaUJBQUksQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9jb250cm9sbGVyLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2FybW9yLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9kaWUudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2hlcm9lc1NpbmdsZXRvbi50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvc2hpZWxkLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS93ZWFwb24udHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL3dvcmtlci93b3JrZXIudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByaW1lV29ya2VyIGZyb20gXCJ3b3JrZXItbG9hZGVyIS4vd29ya2VyL3dvcmtlclwiO1xyXG5cclxubGV0IGlzUG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kQ2hlY2tlZCA9IGZhbHNlO1xyXG5sZXQgaXNEZWZlbmRWc1BvbGVDaGFyZ2VDaGVja2VkID0gZmFsc2U7XHJcbmxldCBpc1ZlcmJvc2VDaGVja2VkID0gZmFsc2U7XHJcblxyXG5sZXQgcHJpbWVXb3JrZXI6IFByaW1lV29ya2VyID0gbmV3IFByaW1lV29ya2VyKCk7XHJcblxyXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODY3MjYyLzExNjgzNDJcclxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWRWYWx1ZXMoc2VsZWN0RWxlbWVudDogSFRNTERhdGFMaXN0RWxlbWVudCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBzZWxlY3RFbGVtZW50ICYmIHNlbGVjdEVsZW1lbnQub3B0aW9ucztcclxuICAgIGxldCBvcHQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlMZW4gPSBvcHRpb25zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICAgIG9wdCA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgIGlmIChvcHQuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gob3B0LnZhbHVlIHx8IG9wdC50ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckRpdihpZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgd2hpbGUgKGRpdi5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgZGl2LnJlbW92ZUNoaWxkKGRpdi5maXJzdENoaWxkKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KHRoaXM6IEdsb2JhbEV2ZW50SGFuZGxlcnMsIF9ldjogTW91c2VFdmVudCkge1xyXG5cclxuICAgIGlzUG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kQ2hlY2tlZCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG4gICAgaXNEZWZlbmRWc1BvbGVDaGFyZ2VDaGVja2VkID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmZW5kVnNQb2xlQ2hhcmdlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcbiAgICBpc1ZlcmJvc2VDaGVja2VkID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmVyYm9zZU91dHB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG5cclxuICAgIC8vICd0aGlzJyBpcyB0aGUgYnV0dG9uIHRoYXQgd2FzIGNsaWNrZWQgKG9uY2xpY2spXHJcbiAgICBsZXQgc3RhcnRCdXR0b24gPSB0aGlzIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBsZXQgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcFNpbXVsYXRpb25cIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN0b3BCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NcIik7XHJcbiAgICBpZiAocHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IDAgKyBcIiVcIjtcclxuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCI7IC8vIGRvbid0IHVzZSBib290c3RyYXAgYW5pbWF0aW9uIG9mIHByb2dyZXNzIGJhclxyXG4gICAgICAgIC8vcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gdHVybiBvbiBhbmltYXRlZCBzdHJpcGVkIGJhclxyXG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIik7IC8vIHR1cm4gb24gYW5pbWF0ZWQgc3RyaXBlZCBiYXJcclxuICAgIH1cclxuICAgIGxldCB2ZXJib3NlT3V0cHV0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmVyYm9zZU91dHB1dFRleHRcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgIHZlcmJvc2VPdXRwdXRUZXh0LnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHJlc3VsdHMgZnJvbSBwcmV2aW91cyBydW5cclxuICAgICAqL1xyXG4gICAgY2xlYXJEaXYoXCJoZXJvV2luc1wiKTtcclxuICAgIGNsZWFyRGl2KFwibWF0Y2h1cFdpbnNcIik7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnRpbmcgc2ltdWxhdGlvbicpO1xyXG4gICAgY29uc3QgaHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlcm9XaW5zXCIpO1xyXG4gICAgY29uc3QgbXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hdGNodXBXaW5zXCIpO1xyXG4gICAgbGV0IGxvZ0J1ZmZlciA9IFwiXCI7XHJcbiAgICBpZiAoaHcgJiYgbXcgJiYgcHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgICBwcmltZVdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGE7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJXZWIgd29ya2VyIG1lc3NhZ2VkIG1lOiBcIiArIGV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuY21kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdsb2cnOlxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ0J1ZmZlciArPSBkYXRhLm1lc3NhZ2UgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Byb2dyZXNzVXBkYXRlJzpcclxuICAgICAgICAgICAgICAgICAgICAvL3Byb2dyZXNzQmFyLnZhbHVlID0gZGF0YS5wcm9ncmVzcztcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgucm91bmQoZGF0YS5wcm9ncmVzcyAvIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBwcm9ncmVzcyArIFwiJVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0Jhcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLmlubmVyVGV4dCA9IGxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJUZXh0ID0gXCJDcmVhdGluZyBmaW5hbCByZXN1bHRzLi4uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmluaXNoZWQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0Jhcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5pbm5lclRleHQgPSBcIlNlZSByZXN1bHRzIGJlbG93LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwicHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIpOyAvLyBzdG9wIGFuaW1hdGVkIHN0cmlwZWQgYmFyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBGaW5pc2hlZDogcmVjZWl2ZWQgJHtkYXRhLmhlcm9XaW5zfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIENsZWFyIG1lc3NhZ2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJEaXYoXCJoZXJvV2luc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckRpdihcIm1hdGNodXBXaW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlcm9XaW5zVGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVyb1dpbnNUYWJsZS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlcm9XaW5zVGFibGUuY2xhc3NOYW1lID0gXCJzb3J0YWJsZSB0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWNvbmRlbnNlZCBjYXB0aW9uLXRvcFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGh3LmFwcGVuZENoaWxkKGhlcm9XaW5zVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlcm9XaW5zVGFibGUuaW5uZXJIVE1MID0gZGF0YS5oZXJvV2luc1RhYmxlSFRNTDtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUubWFrZVNvcnRhYmxlKGhlcm9XaW5zVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaHVwV2luc1RhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zVGFibGUuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaHVwV2luc1RhYmxlLmNsYXNzTmFtZSA9IFwic29ydGFibGUgdGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1jb25kZW5zZWQgY2FwdGlvbi10b3BcIjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaHVwV2luc1RhYmxlLmlubmVySFRNTCA9IGRhdGEubWF0Y2h1cFdpbnNUYWJsZUhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgbXcuYXBwZW5kQ2hpbGQobWF0Y2h1cFdpbnNUYWJsZSlcclxuICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUubWFrZVNvcnRhYmxlKG1hdGNodXBXaW5zVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBGb3JjZSB0YWJsZXMgdG8gYmUgc29ydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG15VEggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hdGNod2luc1wiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobXlUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUuaW5uZXJTb3J0RnVuY3Rpb24uYXBwbHkobXlUSCwgW215VEhdKTsgLy8gb25jZSBmb3IgYXNjZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBhZ2FpbiBmb3IgZGVzY2VuZGluZyAoc3R1cGlkIGJ1dCBpdCdzIGhvdyBpdCB3b3JrcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbXlUSCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2luc1wiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDsgLy8gdG9wIHRhYmxlIGxhc3QsIHNpbmNlIHRoZSBpY29uIG9ubHkgc2hvd3Mgb24gbGFzdCB0YWJsZSBzb3J0ZWQuLi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXlUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUuaW5uZXJTb3J0RnVuY3Rpb24uYXBwbHkobXlUSCwgW215VEhdKTsgLy8gb25jZSBmb3IgYXNjZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBhZ2FpbiBmb3IgZGVzY2VuZGluZyAoc3R1cGlkIGJ1dCBpdCdzIGhvdyBpdCB3b3JrcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYExvZzpcXG4ke2xvZ0J1ZmZlcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJib3NlT3V0cHV0VGV4dC52YWx1ZSA9IGxvZ0J1ZmZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9wQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5yZWNvZ25pemVkIG1lc3NhZ2UgZnJvbSB3ZWIgd29ya2VyOiBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaW1lV29ya2VyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV09SS0VSIEVSUk9SXCIsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWVzc2FnZSB0aGUgd29ya2VyIHRvIGRvIHRoZSBzaW11bGF0aW9uXHJcbiAgICAgICAgY29uc3QgYm91dENvdW50OiBudW1iZXIgPSBwYXJzZUludCgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3V0c1Blck1hdGNodXBcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlcm9lc1NlbGVjdGVkXCIpIGFzIEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRIZXJvZXMgPSBnZXRTZWxlY3RlZFZhbHVlcyhzZWxlY3RFbGVtZW50KTtcclxuICAgICAgICAvLyBnaXZlIHdvcmtlciB0aGUgaW5mb1xyXG4gICAgICAgIHByaW1lV29ya2VyLnBvc3RNZXNzYWdlKHsgJ2NtZCc6ICdkbyBzaW11bGF0aW9uJywgJ3NlbGVjdGVkSGVyb2VzJzogc2VsZWN0ZWRIZXJvZXMsICdib3V0Q291bnQnOiBib3V0Q291bnQsICdpc1BvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCc6IGlzUG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kQ2hlY2tlZCwgJ2lzRGVmZW5kVnNQb2xlQ2hhcmdlJzogaXNEZWZlbmRWc1BvbGVDaGFyZ2VDaGVja2VkLCAnaXNWZXJib3NlJzogaXNWZXJib3NlQ2hlY2tlZCB9KTtcclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICBwLmNsYXNzTmFtZSA9IFwiYmctaW5mb1wiO1xyXG4gICAgICAgIHAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJDYWxjdWxhdGluZyByZXN1bHRzIC0gcGxlYXNlIHdhaXQuXCIpKTtcclxuICAgICAgICBtdy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIHAuY2xhc3NOYW1lID0gXCJiZy1pbmZvXCI7XHJcbiAgICAgICAgcC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkNhbGN1bGF0aW5nIHJlc3VsdHMgLSBwbGVhc2Ugd2FpdC5cIikpO1xyXG4gICAgICAgIGh3LmFwcGVuZENoaWxkKHApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNvdWxkbid0IGZpbmQgaGVyb1dpbnMgb3IgbWF0Y2h1cFdpbnMgb3IgcHJvZ3Jlc3MgYmFyIGVsZW1lbnQgb24gcGFnZSFcIilcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RvcCh0aGlzOiBHbG9iYWxFdmVudEhhbmRsZXJzLCBfZXY6IE1vdXNlRXZlbnQpIHtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcCB0aGUgd2ViIHdvcmtlclxyXG4gICAgICovXHJcbiAgICBsZXQgc3RvcEJ1dHRvbiA9IHRoaXMgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN0b3BCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgcHJpbWVXb3JrZXIudGVybWluYXRlKCk7XHJcbiAgICBwcmltZVdvcmtlciA9IG5ldyBQcmltZVdvcmtlcigpO1xyXG5cclxuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NcIik7XHJcbiAgICBpZiAocHJvZ3Jlc3NCYXIpIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIik7IC8vIHN0b3AgYW5pbWF0ZWQgc3RyaXBlZCBiYXJcclxuXHJcbiAgICBsZXQgbXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hdGNodXBXaW5zXCIpO1xyXG4gICAgbGV0IGh3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvV2luc1wiKTtcclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgcmVzdWx0cyBmcm9tIHByZXZpb3VzIHJ1blxyXG4gICAgICovXHJcbiAgICBjbGVhckRpdihcImhlcm9XaW5zXCIpO1xyXG4gICAgY2xlYXJEaXYoXCJtYXRjaHVwV2luc1wiKTtcclxuXHJcbiAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHAuY2xhc3NOYW1lID0gXCJiZy13YXJuaW5nXCI7XHJcbiAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBiZWNhdXNlIHRoZSBzaW11bGF0b3Igd2FzIHN0b3BwZWQgYmVmb3JlIGl0IGZpbmlzaGVkLlwiKSk7XHJcbiAgICBpZiAobXcpIG13LmFwcGVuZENoaWxkKHApO1xyXG4gICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHAuY2xhc3NOYW1lID0gXCJiZy13YXJuaW5nXCI7XHJcbiAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBiZWNhdXNlIHRoZSBzaW11bGF0b3Igd2FzIHN0b3BwZWQgYmVmb3JlIGl0IGZpbmlzaGVkLlwiKSk7XHJcbiAgICBpZiAoaHcpIGh3LmFwcGVuZENoaWxkKHApO1xyXG4gICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRTaW11bGF0aW9uXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbn07XHJcbiIsImxldCBpc011dGUgPSBmYWxzZTtcclxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIC8vIGlmICghaXNNdXRlKSBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuICAgIGlmICghaXNNdXRlKSBwb3N0TWVzc2FnZSh7IFwiY21kXCI6IFwibG9nXCIsIFwibWVzc2FnZVwiOiBtZXNzYWdlIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TXV0ZShjaGFuZ2VJc011dGU6IGJvb2xlYW4pIHtcclxuICAgIGlzTXV0ZSA9IGNoYW5nZUlzTXV0ZTtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQXJtb3Ige1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaGl0c1N0b3BwZWQ6IG51bWJlcjtcclxuICAgIG1hQWRqOiBudW1iZXI7XHJcbiAgICBkeEFkajogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBoaXRzU3RvcHBlZDogbnVtYmVyLCBtYUFkajogbnVtYmVyLCBkeEFkajogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmhpdHNTdG9wcGVkID0gaGl0c1N0b3BwZWQ7XHJcbiAgICAgICAgdGhpcy5tYUFkaiA9IG1hQWRqO1xyXG4gICAgICAgIHRoaXMuZHhBZGogPSBkeEFkajtcclxuICAgIH1cclxuICAgIHN0YXRpYyBOT19BUk1PUiA9IG5ldyBBcm1vcihcIk5vIGFybW9yXCIsIDAsIDAsIDApO1xyXG4gICAgc3RhdGljIExFQVRIRVIgPSBuZXcgQXJtb3IoXCJMZWF0aGVyXCIsIDIsIDIsIDIpO1xyXG4gICAgc3RhdGljIENIQUlOID0gbmV3IEFybW9yKFwiQ2hhaW5cIiwgMywgNCwgNCk7XHJcbiAgICBzdGF0aWMgUExBVEUgPSBuZXcgQXJtb3IoXCJQbGF0ZVwiLCA1LCA2LCA2KTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGwoKSB7XHJcbiAgICBjb25zdCByb2xsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNiArIDEpO1xyXG4gICAgbG9nKGBEaWUgcm9sbDogJHtyb2xsfWApO1xyXG4gICAgcmV0dXJuIHJvbGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRGljZShudW1EaWNlOiBudW1iZXIpIHtcclxuICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EaWNlOyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gcm9sbCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxUaHJlZURpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoMyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRm91ckRpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoNCk7XHJcbn0iLCJpbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgQXJtb3IgfSBmcm9tIFwiLi9hcm1vclwiO1xyXG5pbXBvcnQgeyBTaGllbGQgfSBmcm9tIFwiLi9zaGllbGRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIZXJvZXNTaW5nbGV0b24ge1xyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTc1Mzg0MS8xMTY4MzQyXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsaXN0SGVpZ2h0ID0gMTU7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZXJvZXNMaXN0SlNPTiA9XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDFcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwMlwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDNcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwNFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA1XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDZcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA3XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDhcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwOVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTNcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxNFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTVcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxNlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE3XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE4XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTlcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjBcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjJcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyM1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI3XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI4XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI5XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzJcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzNcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzRcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzNVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzNlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzN1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzOFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM5XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQwXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQxXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0M1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDRcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ1XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0NlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0N1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDhcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ5XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1MFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1MVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTJcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUzXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1NFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1NVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTZcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU3XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1OFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1OVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjBcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYxXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2MlwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2M1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjRcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY1XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjZcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY3XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjhcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2OVwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzBcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzFcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcyXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3M1wiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzRcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzVcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc2XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3N1wiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc4XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3OVwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgwXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODFcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4MlwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODNcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg1XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NlwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4N1wiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODhcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg5XCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5MFwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5MVwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTJcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkzXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTRcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk1XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTZcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5N1wiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOThcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTlcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAwXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMVwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAyXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwM1wiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA0XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDVcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA2XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA3XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwOFwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9XHJcbiAgICAgICAgXTtcclxuICAgIHN0YXRpYyBnZXRIZXJvZXNMaXN0SlNPTigpIHtcclxuICAgICAgICByZXR1cm4gSGVyb2VzU2luZ2xldG9uLmhlcm9lc0xpc3RKU09OO1xyXG4gICAgfTtcclxuICAgIHN0YXRpYyBnZXRMaXN0SGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBIZXJvZXNTaW5nbGV0b24ubGlzdEhlaWdodDtcclxuICAgIH07XHJcbiAgICBzdGF0aWMgZ2V0TmFtZUZyb21JRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgaGVybyA9IHRoaXMuaGVyb2VzTGlzdEpTT04uZmluZChoZXJvID0+IGhlcm8uaWQgPT0gaWQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBoZXJvID8gYCR7aGVyby5pZH06U1Qke2hlcm8uc3R9O0RYJHtoZXJvLmR4fTske2hlcm8ud2VhcG9uLm5hbWV9OyR7aGVyby5hcm1vci5uYW1lfTske2hlcm8uc2hpZWxkLm5hbWV9YC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1sgLV0vZywgJ18nKSA6IGAoaGVybyBpZCAke2lkfSBub3QgZm91bmQpYDtcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2hpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGhpdHNTdG9wcGVkOiBudW1iZXI7XHJcbiAgICBkeEFkajogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBoaXRzU3RvcHBlZDogbnVtYmVyLCBkeEFkajogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaGl0c1N0b3BwZWQgPSBoaXRzU3RvcHBlZDtcclxuICAgICAgICB0aGlzLmR4QWRqID0gZHhBZGo7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgTk9fU0hJRUxEID0gbmV3IFNoaWVsZChcIk5vIHNoaWVsZFwiLCAwLCAwKTtcclxuICAgIHN0YXRpYyBTTUFMTF9TSElFTEQgPSBuZXcgU2hpZWxkKFwiU21hbGwgc2hpZWxkXCIsIDEsIDApO1xyXG4gICAgc3RhdGljIExBUkdFX1NISUVMRCA9IG5ldyBTaGllbGQoXCJMYXJnZSBzaGllbGRcIiwgMiwgMSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbERpY2UgfSBmcm9tIFwiLi9kaWVcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYXBvbiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdDogbnVtYmVyO1xyXG4gICAgZGljZTogbnVtYmVyO1xyXG4gICAgbW9kaWZpZXI6IG51bWJlcjtcclxuICAgIGlzVHdvSGFuZGVkOiBib29sZWFuO1xyXG4gICAgaXNUaHJvd246IGJvb2xlYW47XHJcbiAgICBpc1BvbGU6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHN0OiBudW1iZXIsXHJcbiAgICAgICAgZGljZTogbnVtYmVyLFxyXG4gICAgICAgIG1vZGlmaWVyOiBudW1iZXIsXHJcbiAgICAgICAgaXNUd29IYW5kZWQ6IGJvb2xlYW4sXHJcbiAgICAgICAgaXNUaHJvd246IGJvb2xlYW4sXHJcbiAgICAgICAgaXNQb2xlOiBib29sZWFuLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN0ID0gc3Q7XHJcbiAgICAgICAgdGhpcy5kaWNlID0gZGljZTtcclxuICAgICAgICB0aGlzLm1vZGlmaWVyID0gbW9kaWZpZXI7XHJcbiAgICAgICAgdGhpcy5pc1R3b0hhbmRlZCA9IGlzVHdvSGFuZGVkO1xyXG4gICAgICAgIHRoaXMuaXNQb2xlID0gaXNQb2xlO1xyXG4gICAgICAgIHRoaXMuaXNUaHJvd24gPSBpc1Rocm93bjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZG9EYW1hZ2UoKSB7XHJcbiAgICAgICAgbG9nKFxyXG4gICAgICAgICAgICBcIlJvbGxpbmcgZm9yIHdlYXBvbiBkb2luZyBcIlxyXG4gICAgICAgICAgICArIHRoaXMuZGljZVxyXG4gICAgICAgICAgICArIFwiZFwiXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyID4gMCkgPyBcIitcIiA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyICE9PSAwKSA/IHRoaXMubW9kaWZpZXIgOiBcIlwiKVxyXG4gICAgICAgICAgICArIFwiIGRhbWFnZS5cIik7XHJcbiAgICAgICAgbGV0IGRhbWFnZSA9IDA7XHJcbiAgICAgICAgZGFtYWdlICs9IHJvbGxEaWNlKHRoaXMuZGljZSk7XHJcbiAgICAgICAgZGFtYWdlICs9IHRoaXMubW9kaWZpZXI7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kaWZpZXIgIT09IDApIGxvZygoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyB0aGlzLm1vZGlmaWVyKTtcclxuICAgICAgICBpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuICAgICAgICBsb2coYFRvdGFsIHdlYXBvbiBkYW1hZ2U6ICR7ZGFtYWdlfWApO1xyXG4gICAgICAgIHJldHVybiBkYW1hZ2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgXCIgKFwiICsgdGhpcy5kaWNlICsgXCJEXCIgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpICsgXCIpXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBOT05FID0gbmV3IFdlYXBvbihcIk5vbmVcIiwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgREFHR0VSID0gbmV3IFdlYXBvbihcIkRhZ2dlclwiLCAwLCAxLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBSQVBJRVIgPSBuZXcgV2VhcG9uKFwiUmFwaWVyXCIsIDksIDEsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIENMVUIgPSBuZXcgV2VhcG9uKFwiQ2x1YlwiLCA5LCAxLCAwLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEhBTU1FUiA9IG5ldyBXZWFwb24oXCJIYW1tZXJcIiwgMTAsIDEsIDEsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ1VUTEFTUyA9IG5ldyBXZWFwb24oXCJDdXRsYXNzXCIsIDEwLCAyLCAtMiwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgU0hPUlRTV09SRCA9IG5ldyBXZWFwb24oXCJTaG9ydHN3b3JkXCIsIDExLCAyLCAtMSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTUFDRSA9IG5ldyBXZWFwb24oXCJNYWNlXCIsIDExLCAyLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTTUFMTF9BWCA9IG5ldyBXZWFwb24oXCJTbWFsbCBheFwiLCAxMSwgMSwgMiwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBCUk9BRFNXT1JEID0gbmV3IFdlYXBvbihcIkJyb2Fkc3dvcmRcIiwgMTIsIDIsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIE1PUk5JTkdTVEFSID0gbmV3IFdlYXBvbihcIk1vcm5pbmdzdGFyXCIsIDEzLCAyLCAxLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBUV09fSEFOREVEX1NXT1JEID0gbmV3IFdlYXBvbihcIlR3by1oYW5kZWQgc3dvcmRcIiwgMTQsIDMsIC0xLCBmYWxzZSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJBVFRMRUFYRSA9IG5ldyBXZWFwb24oXCJCYXR0bGVheGVcIiwgMTUsIDMsIDAsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gcG9sZSB3ZWFwb25zXHJcbiAgICBzdGF0aWMgSkFWRUxJTiA9IG5ldyBXZWFwb24oXCJKYXZlbGluXCIsIDksIDEsIC0xLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgU1BFQVIgPSBuZXcgV2VhcG9uKFwiU3BlYXJcIiwgMTEsIDEsIDEsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIEhBTEJFUkQgPSBuZXcgV2VhcG9uKFwiSGFsYmVyZFwiLCAxMywgMiwgLTEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBQSUtFX0FYRSA9IG5ldyBXZWFwb24oXCJQaWtlIGF4ZVwiLCAxNSwgMiwgMiwgZmFsc2UsIHRydWUsIHRydWUpOyAgICAvLyBBbmQgbm93IHJldHVybiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdvcmtlcl9mbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImJ1bmRsZS53b3JrZXIuanNcIik7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjsiLCJpbXBvcnQgeyBzdGFydCwgc3RvcCB9IGZyb20gJy4vY29udHJvbGxlcic7XHJcbmltcG9ydCB7IEhlcm9lc1NpbmdsZXRvbiB9IGZyb20gJy4vbWVsZWUvaGVyb2VzU2luZ2xldG9uJztcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGxpc3Qgb2YgaGVyb2VzIHRvIGJlIHNlbGVjdGVkXHJcbiAqL1xyXG52YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvZXNTZWxlY3RlZFwiKTtcclxudmFyIG9wdCA9IG51bGw7XHJcbnZhciBoZXJvZXNMaXN0SlNPTiA9IEhlcm9lc1NpbmdsZXRvbi5nZXRIZXJvZXNMaXN0SlNPTigpO1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGhlcm9lc0xpc3RKU09OLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgaGVyb0pTT04gPSBoZXJvZXNMaXN0SlNPTltpXTtcclxuICAgIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgb3B0LnZhbHVlID0gaGVyb0pTT04uaWQ7XHJcbiAgICBvcHQuaW5uZXJIVE1MID0gSGVyb2VzU2luZ2xldG9uLmdldE5hbWVGcm9tSUQoaGVyb0pTT04uaWQpO1xyXG4gICAgaWYgKHNlbGVjdCkgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdXAgY29udHJvbGxlciBvcHRpb25zXHJcbiAqL1xyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydFNpbXVsYXRpb24nKTtcclxuaWYgKHN0YXJ0QnV0dG9uKSBzdGFydEJ1dHRvbi5vbmNsaWNrID0gc3RhcnQ7XHJcbmNvbnN0IHN0b3BCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcFNpbXVsYXRpb24nKTtcclxuaWYgKHN0b3BCdXR0b24pIHN0b3BCdXR0b24ub25jbGljayA9IHN0b3A7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==