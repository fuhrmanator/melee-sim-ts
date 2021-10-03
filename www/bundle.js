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
                        progressBar.classList.remove("bg-info"); // success
                        progressBar.classList.add("bg-success"); //
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
        progressBar.classList.remove("bg-success"); // info
        progressBar.classList.remove("bg-warning");
        progressBar.classList.add("bg-info");
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
    if (progressBar) {
        progressBar.classList.remove("progress-bar-animated"); // stop animated striped bar
        progressBar.classList.remove("bg-info"); // show a warning
        progressBar.classList.add("bg-warning");
        progressBar.innerText = "Canceled at " + progressBar.innerText;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDOUcsRUFBRSxJ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Q0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN2SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN4SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3ZILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDN0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM3RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN2SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN6SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN0SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN0SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3RILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQzNILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMxSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUs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LENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsYUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsYUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsY0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsaUJBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pELGVBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUs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OztHQUVHO0FBQ0gsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9ELElBQUksV0FBVztJQUFFLFdBQVcsQ0FBQyxPQUFPLEdBQUcsa0JBQUssQ0FBQztBQUM3QyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDN0QsSUFBSSxVQUFVO0lBQUUsVUFBVSxDQUFDLE9BQU8sR0FBRyxpQkFBSSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL2NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL2xvZ2dlci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvYXJtb3IudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2RpZS50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvaGVyb2VzU2luZ2xldG9uLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9zaGllbGQudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL3dlYXBvbi50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvd29ya2VyL3dvcmtlci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJpbWVXb3JrZXIgZnJvbSBcIndvcmtlci1sb2FkZXIhLi93b3JrZXIvd29ya2VyXCI7XHJcblxyXG5sZXQgaXNQb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmRDaGVja2VkID0gZmFsc2U7XHJcbmxldCBpc0RlZmVuZFZzUG9sZUNoYXJnZUNoZWNrZWQgPSBmYWxzZTtcclxubGV0IGlzVmVyYm9zZUNoZWNrZWQgPSBmYWxzZTtcclxuXHJcbmxldCBwcmltZVdvcmtlcjogUHJpbWVXb3JrZXIgPSBuZXcgUHJpbWVXb3JrZXIoKTtcclxuXHJcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4NjcyNjIvMTE2ODM0MlxyXG5mdW5jdGlvbiBnZXRTZWxlY3RlZFZhbHVlcyhzZWxlY3RFbGVtZW50OiBIVE1MRGF0YUxpc3RFbGVtZW50KSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgb3B0aW9ucyA9IHNlbGVjdEVsZW1lbnQgJiYgc2VsZWN0RWxlbWVudC5vcHRpb25zO1xyXG4gICAgbGV0IG9wdDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaUxlbiA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgICAgb3B0ID0gb3B0aW9uc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKG9wdC5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChvcHQudmFsdWUgfHwgb3B0LnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyRGl2KGlkOiBzdHJpbmcpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICB3aGlsZSAoZGl2LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICBkaXYucmVtb3ZlQ2hpbGQoZGl2LmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQodGhpczogR2xvYmFsRXZlbnRIYW5kbGVycywgX2V2OiBNb3VzZUV2ZW50KSB7XHJcblxyXG4gICAgaXNQb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmRDaGVja2VkID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcbiAgICBpc0RlZmVuZFZzUG9sZUNoYXJnZUNoZWNrZWQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZlbmRWc1BvbGVDaGFyZ2VcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuICAgIGlzVmVyYm9zZUNoZWNrZWQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2ZXJib3NlT3V0cHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcblxyXG4gICAgLy8gJ3RoaXMnIGlzIHRoZSBidXR0b24gdGhhdCB3YXMgY2xpY2tlZCAob25jbGljaylcclxuICAgIGxldCBzdGFydEJ1dHRvbiA9IHRoaXMgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN0YXJ0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGxldCBzdG9wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wU2ltdWxhdGlvblwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc3RvcEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9ncmVzc1wiKTtcclxuICAgIGlmIChwcm9ncmVzc0Jhcikge1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gMCArIFwiJVwiO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIjsgLy8gZG9uJ3QgdXNlIGJvb3RzdHJhcCBhbmltYXRpb24gb2YgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgLy9wcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyB0dXJuIG9uIGFuaW1hdGVkIHN0cmlwZWQgYmFyXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcInByb2dyZXNzLWJhci1hbmltYXRlZFwiKTsgLy8gdHVybiBvbiBhbmltYXRlZCBzdHJpcGVkIGJhclxyXG4gICAgfVxyXG4gICAgbGV0IHZlcmJvc2VPdXRwdXRUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2ZXJib3NlT3V0cHV0VGV4dFwiKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgdmVyYm9zZU91dHB1dFRleHQudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgcmVzdWx0cyBmcm9tIHByZXZpb3VzIHJ1blxyXG4gICAgICovXHJcbiAgICBjbGVhckRpdihcImhlcm9XaW5zXCIpO1xyXG4gICAgY2xlYXJEaXYoXCJtYXRjaHVwV2luc1wiKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdTdGFydGluZyBzaW11bGF0aW9uJyk7XHJcbiAgICBjb25zdCBodyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVyb1dpbnNcIik7XHJcbiAgICBjb25zdCBtdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF0Y2h1cFdpbnNcIik7XHJcbiAgICBsZXQgbG9nQnVmZmVyID0gXCJcIjtcclxuICAgIGlmIChodyAmJiBtdyAmJiBwcm9ncmVzc0Jhcikge1xyXG4gICAgICAgIHByaW1lV29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIldlYiB3b3JrZXIgbWVzc2FnZWQgbWU6IFwiICsgZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5jbWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvZyc6XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQnVmZmVyICs9IGRhdGEubWVzc2FnZSArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAncHJvZ3Jlc3NVcGRhdGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vcHJvZ3Jlc3NCYXIudmFsdWUgPSBkYXRhLnByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5yb3VuZChkYXRhLnByb2dyZXNzIC8gMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYWJlbCA9IHByb2dyZXNzICsgXCIlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzQmFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gbGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJUZXh0ID0gbGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5pbm5lclRleHQgPSBcIkNyZWF0aW5nIGZpbmFsIHJlc3VsdHMuLi5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdmaW5pc2hlZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzQmFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLmlubmVyVGV4dCA9IFwiU2VlIHJlc3VsdHMgYmVsb3cuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIik7IC8vIHN0b3AgYW5pbWF0ZWQgc3RyaXBlZCBiYXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZShcImJnLWluZm9cIik7IC8vIHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImJnLXN1Y2Nlc3NcIik7IC8vXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBGaW5pc2hlZDogcmVjZWl2ZWQgJHtkYXRhLmhlcm9XaW5zfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIENsZWFyIG1lc3NhZ2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJEaXYoXCJoZXJvV2luc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckRpdihcIm1hdGNodXBXaW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlcm9XaW5zVGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVyb1dpbnNUYWJsZS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlcm9XaW5zVGFibGUuY2xhc3NOYW1lID0gXCJzb3J0YWJsZSB0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWNvbmRlbnNlZCBjYXB0aW9uLXRvcFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGh3LmFwcGVuZENoaWxkKGhlcm9XaW5zVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlcm9XaW5zVGFibGUuaW5uZXJIVE1MID0gZGF0YS5oZXJvV2luc1RhYmxlSFRNTDtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUubWFrZVNvcnRhYmxlKGhlcm9XaW5zVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaHVwV2luc1RhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zVGFibGUuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaHVwV2luc1RhYmxlLmNsYXNzTmFtZSA9IFwic29ydGFibGUgdGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1jb25kZW5zZWQgY2FwdGlvbi10b3BcIjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaHVwV2luc1RhYmxlLmlubmVySFRNTCA9IGRhdGEubWF0Y2h1cFdpbnNUYWJsZUhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgbXcuYXBwZW5kQ2hpbGQobWF0Y2h1cFdpbnNUYWJsZSlcclxuICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUubWFrZVNvcnRhYmxlKG1hdGNodXBXaW5zVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBGb3JjZSB0YWJsZXMgdG8gYmUgc29ydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG15VEggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hdGNod2luc1wiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobXlUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUuaW5uZXJTb3J0RnVuY3Rpb24uYXBwbHkobXlUSCwgW215VEhdKTsgLy8gb25jZSBmb3IgYXNjZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBhZ2FpbiBmb3IgZGVzY2VuZGluZyAoc3R1cGlkIGJ1dCBpdCdzIGhvdyBpdCB3b3JrcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbXlUSCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2luc1wiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDsgLy8gdG9wIHRhYmxlIGxhc3QsIHNpbmNlIHRoZSBpY29uIG9ubHkgc2hvd3Mgb24gbGFzdCB0YWJsZSBzb3J0ZWQuLi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXlUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0dGFibGUuaW5uZXJTb3J0RnVuY3Rpb24uYXBwbHkobXlUSCwgW215VEhdKTsgLy8gb25jZSBmb3IgYXNjZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBhZ2FpbiBmb3IgZGVzY2VuZGluZyAoc3R1cGlkIGJ1dCBpdCdzIGhvdyBpdCB3b3JrcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYExvZzpcXG4ke2xvZ0J1ZmZlcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJib3NlT3V0cHV0VGV4dC52YWx1ZSA9IGxvZ0J1ZmZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9wQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5yZWNvZ25pemVkIG1lc3NhZ2UgZnJvbSB3ZWIgd29ya2VyOiBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaW1lV29ya2VyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV09SS0VSIEVSUk9SXCIsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWVzc2FnZSB0aGUgd29ya2VyIHRvIGRvIHRoZSBzaW11bGF0aW9uXHJcbiAgICAgICAgY29uc3QgYm91dENvdW50OiBudW1iZXIgPSBwYXJzZUludCgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3V0c1Blck1hdGNodXBcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlcm9lc1NlbGVjdGVkXCIpIGFzIEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRIZXJvZXMgPSBnZXRTZWxlY3RlZFZhbHVlcyhzZWxlY3RFbGVtZW50KTtcclxuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwiYmctc3VjY2Vzc1wiKTsgLy8gaW5mb1xyXG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJiZy13YXJuaW5nXCIpO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoXCJiZy1pbmZvXCIpO1xyXG5cclxuICAgICAgICAvLyBnaXZlIHdvcmtlciB0aGUgaW5mb1xyXG4gICAgICAgIHByaW1lV29ya2VyLnBvc3RNZXNzYWdlKHsgJ2NtZCc6ICdkbyBzaW11bGF0aW9uJywgJ3NlbGVjdGVkSGVyb2VzJzogc2VsZWN0ZWRIZXJvZXMsICdib3V0Q291bnQnOiBib3V0Q291bnQsICdpc1BvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCc6IGlzUG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kQ2hlY2tlZCwgJ2lzRGVmZW5kVnNQb2xlQ2hhcmdlJzogaXNEZWZlbmRWc1BvbGVDaGFyZ2VDaGVja2VkLCAnaXNWZXJib3NlJzogaXNWZXJib3NlQ2hlY2tlZCB9KTtcclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICBwLmNsYXNzTmFtZSA9IFwiYmctaW5mb1wiO1xyXG4gICAgICAgIHAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJDYWxjdWxhdGluZyByZXN1bHRzIC0gcGxlYXNlIHdhaXQuXCIpKTtcclxuICAgICAgICBtdy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIHAuY2xhc3NOYW1lID0gXCJiZy1pbmZvXCI7XHJcbiAgICAgICAgcC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkNhbGN1bGF0aW5nIHJlc3VsdHMgLSBwbGVhc2Ugd2FpdC5cIikpO1xyXG4gICAgICAgIGh3LmFwcGVuZENoaWxkKHApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNvdWxkbid0IGZpbmQgaGVyb1dpbnMgb3IgbWF0Y2h1cFdpbnMgb3IgcHJvZ3Jlc3MgYmFyIGVsZW1lbnQgb24gcGFnZSFcIilcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RvcCh0aGlzOiBHbG9iYWxFdmVudEhhbmRsZXJzLCBfZXY6IE1vdXNlRXZlbnQpIHtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcCB0aGUgd2ViIHdvcmtlclxyXG4gICAgICovXHJcbiAgICBsZXQgc3RvcEJ1dHRvbiA9IHRoaXMgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN0b3BCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgcHJpbWVXb3JrZXIudGVybWluYXRlKCk7XHJcbiAgICBwcmltZVdvcmtlciA9IG5ldyBQcmltZVdvcmtlcigpO1xyXG5cclxuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NcIik7XHJcbiAgICBpZiAocHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwicHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIpOyAvLyBzdG9wIGFuaW1hdGVkIHN0cmlwZWQgYmFyXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZShcImJnLWluZm9cIik7IC8vIHNob3cgYSB3YXJuaW5nXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImJnLXdhcm5pbmdcIik7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJUZXh0ID0gXCJDYW5jZWxlZCBhdCBcIiArIHByb2dyZXNzQmFyLmlubmVyVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hdGNodXBXaW5zXCIpO1xyXG4gICAgbGV0IGh3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvV2luc1wiKTtcclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgcmVzdWx0cyBmcm9tIHByZXZpb3VzIHJ1blxyXG4gICAgICovXHJcbiAgICBjbGVhckRpdihcImhlcm9XaW5zXCIpO1xyXG4gICAgY2xlYXJEaXYoXCJtYXRjaHVwV2luc1wiKTtcclxuXHJcbiAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHAuY2xhc3NOYW1lID0gXCJiZy13YXJuaW5nXCI7XHJcbiAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBiZWNhdXNlIHRoZSBzaW11bGF0b3Igd2FzIHN0b3BwZWQgYmVmb3JlIGl0IGZpbmlzaGVkLlwiKSk7XHJcbiAgICBpZiAobXcpIG13LmFwcGVuZENoaWxkKHApO1xyXG4gICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHAuY2xhc3NOYW1lID0gXCJiZy13YXJuaW5nXCI7XHJcbiAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBiZWNhdXNlIHRoZSBzaW11bGF0b3Igd2FzIHN0b3BwZWQgYmVmb3JlIGl0IGZpbmlzaGVkLlwiKSk7XHJcbiAgICBpZiAoaHcpIGh3LmFwcGVuZENoaWxkKHApO1xyXG4gICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRTaW11bGF0aW9uXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbn07XHJcbiIsImxldCBpc011dGUgPSBmYWxzZTtcclxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIC8vIGlmICghaXNNdXRlKSBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuICAgIGlmICghaXNNdXRlKSBwb3N0TWVzc2FnZSh7IFwiY21kXCI6IFwibG9nXCIsIFwibWVzc2FnZVwiOiBtZXNzYWdlIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TXV0ZShjaGFuZ2VJc011dGU6IGJvb2xlYW4pIHtcclxuICAgIGlzTXV0ZSA9IGNoYW5nZUlzTXV0ZTtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQXJtb3Ige1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaGl0c1N0b3BwZWQ6IG51bWJlcjtcclxuICAgIG1hQWRqOiBudW1iZXI7XHJcbiAgICBkeEFkajogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBoaXRzU3RvcHBlZDogbnVtYmVyLCBtYUFkajogbnVtYmVyLCBkeEFkajogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmhpdHNTdG9wcGVkID0gaGl0c1N0b3BwZWQ7XHJcbiAgICAgICAgdGhpcy5tYUFkaiA9IG1hQWRqO1xyXG4gICAgICAgIHRoaXMuZHhBZGogPSBkeEFkajtcclxuICAgIH1cclxuICAgIHN0YXRpYyBOT19BUk1PUiA9IG5ldyBBcm1vcihcIk5vIGFybW9yXCIsIDAsIDAsIDApO1xyXG4gICAgc3RhdGljIExFQVRIRVIgPSBuZXcgQXJtb3IoXCJMZWF0aGVyXCIsIDIsIDIsIDIpO1xyXG4gICAgc3RhdGljIENIQUlOID0gbmV3IEFybW9yKFwiQ2hhaW5cIiwgMywgNCwgNCk7XHJcbiAgICBzdGF0aWMgUExBVEUgPSBuZXcgQXJtb3IoXCJQbGF0ZVwiLCA1LCA2LCA2KTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGwoKSB7XHJcbiAgICBjb25zdCByb2xsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNiArIDEpO1xyXG4gICAgbG9nKGBEaWUgcm9sbDogJHtyb2xsfWApO1xyXG4gICAgcmV0dXJuIHJvbGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRGljZShudW1EaWNlOiBudW1iZXIpIHtcclxuICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EaWNlOyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gcm9sbCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxUaHJlZURpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoMyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRm91ckRpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoNCk7XHJcbn0iLCJpbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgQXJtb3IgfSBmcm9tIFwiLi9hcm1vclwiO1xyXG5pbXBvcnQgeyBTaGllbGQgfSBmcm9tIFwiLi9zaGllbGRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIZXJvZXNTaW5nbGV0b24ge1xyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTc1Mzg0MS8xMTY4MzQyXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsaXN0SGVpZ2h0ID0gMTU7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZXJvZXNMaXN0SlNPTiA9XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDFcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwMlwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDNcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwNFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA1XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDZcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA3XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDhcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwOVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTNcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxNFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTVcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxNlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE3XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE4XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTlcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjBcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjJcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyM1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyNlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI3XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI4XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI5XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzJcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzNcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzRcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzNVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzNlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzN1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzOFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM5XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQwXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQxXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0M1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDRcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ1XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0NlwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0N1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDhcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ5XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1MFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1MVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTJcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUzXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1NFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1NVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTZcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU3XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1OFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1OVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjBcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYxXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2MlwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2M1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjRcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY1XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjZcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY3XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjhcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2OVwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzBcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzFcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcyXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3M1wiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzRcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzVcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc2XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3N1wiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc4XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3OVwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgwXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODFcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4MlwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODNcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg1XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NlwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4N1wiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODhcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg5XCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5MFwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5MVwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTJcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkzXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTRcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk1XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTZcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5N1wiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOThcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTlcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAwXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMVwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAyXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwM1wiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA0XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDVcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA2XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA3XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwOFwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9XHJcbiAgICAgICAgXTtcclxuICAgIHN0YXRpYyBnZXRIZXJvZXNMaXN0SlNPTigpIHtcclxuICAgICAgICByZXR1cm4gSGVyb2VzU2luZ2xldG9uLmhlcm9lc0xpc3RKU09OO1xyXG4gICAgfTtcclxuICAgIHN0YXRpYyBnZXRMaXN0SGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBIZXJvZXNTaW5nbGV0b24ubGlzdEhlaWdodDtcclxuICAgIH07XHJcbiAgICBzdGF0aWMgZ2V0TmFtZUZyb21JRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgaGVybyA9IHRoaXMuaGVyb2VzTGlzdEpTT04uZmluZChoZXJvID0+IGhlcm8uaWQgPT0gaWQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBoZXJvID8gYCR7aGVyby5pZH06U1Qke2hlcm8uc3R9O0RYJHtoZXJvLmR4fTske2hlcm8ud2VhcG9uLm5hbWV9OyR7aGVyby5hcm1vci5uYW1lfTske2hlcm8uc2hpZWxkLm5hbWV9YC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1sgLV0vZywgJ18nKSA6IGAoaGVybyBpZCAke2lkfSBub3QgZm91bmQpYDtcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2hpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGhpdHNTdG9wcGVkOiBudW1iZXI7XHJcbiAgICBkeEFkajogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBoaXRzU3RvcHBlZDogbnVtYmVyLCBkeEFkajogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaGl0c1N0b3BwZWQgPSBoaXRzU3RvcHBlZDtcclxuICAgICAgICB0aGlzLmR4QWRqID0gZHhBZGo7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgTk9fU0hJRUxEID0gbmV3IFNoaWVsZChcIk5vIHNoaWVsZFwiLCAwLCAwKTtcclxuICAgIHN0YXRpYyBTTUFMTF9TSElFTEQgPSBuZXcgU2hpZWxkKFwiU21hbGwgc2hpZWxkXCIsIDEsIDApO1xyXG4gICAgc3RhdGljIExBUkdFX1NISUVMRCA9IG5ldyBTaGllbGQoXCJMYXJnZSBzaGllbGRcIiwgMiwgMSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbERpY2UgfSBmcm9tIFwiLi9kaWVcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYXBvbiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdDogbnVtYmVyO1xyXG4gICAgZGljZTogbnVtYmVyO1xyXG4gICAgbW9kaWZpZXI6IG51bWJlcjtcclxuICAgIGlzVHdvSGFuZGVkOiBib29sZWFuO1xyXG4gICAgaXNUaHJvd246IGJvb2xlYW47XHJcbiAgICBpc1BvbGU6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHN0OiBudW1iZXIsXHJcbiAgICAgICAgZGljZTogbnVtYmVyLFxyXG4gICAgICAgIG1vZGlmaWVyOiBudW1iZXIsXHJcbiAgICAgICAgaXNUd29IYW5kZWQ6IGJvb2xlYW4sXHJcbiAgICAgICAgaXNUaHJvd246IGJvb2xlYW4sXHJcbiAgICAgICAgaXNQb2xlOiBib29sZWFuLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN0ID0gc3Q7XHJcbiAgICAgICAgdGhpcy5kaWNlID0gZGljZTtcclxuICAgICAgICB0aGlzLm1vZGlmaWVyID0gbW9kaWZpZXI7XHJcbiAgICAgICAgdGhpcy5pc1R3b0hhbmRlZCA9IGlzVHdvSGFuZGVkO1xyXG4gICAgICAgIHRoaXMuaXNQb2xlID0gaXNQb2xlO1xyXG4gICAgICAgIHRoaXMuaXNUaHJvd24gPSBpc1Rocm93bjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZG9EYW1hZ2UoKSB7XHJcbiAgICAgICAgbG9nKFxyXG4gICAgICAgICAgICBcIlJvbGxpbmcgZm9yIHdlYXBvbiBkb2luZyBcIlxyXG4gICAgICAgICAgICArIHRoaXMuZGljZVxyXG4gICAgICAgICAgICArIFwiZFwiXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyID4gMCkgPyBcIitcIiA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyICE9PSAwKSA/IHRoaXMubW9kaWZpZXIgOiBcIlwiKVxyXG4gICAgICAgICAgICArIFwiIGRhbWFnZS5cIik7XHJcbiAgICAgICAgbGV0IGRhbWFnZSA9IDA7XHJcbiAgICAgICAgZGFtYWdlICs9IHJvbGxEaWNlKHRoaXMuZGljZSk7XHJcbiAgICAgICAgZGFtYWdlICs9IHRoaXMubW9kaWZpZXI7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kaWZpZXIgIT09IDApIGxvZygoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyB0aGlzLm1vZGlmaWVyKTtcclxuICAgICAgICBpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuICAgICAgICBsb2coYFRvdGFsIHdlYXBvbiBkYW1hZ2U6ICR7ZGFtYWdlfWApO1xyXG4gICAgICAgIHJldHVybiBkYW1hZ2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgXCIgKFwiICsgdGhpcy5kaWNlICsgXCJEXCIgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpICsgXCIpXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBOT05FID0gbmV3IFdlYXBvbihcIk5vbmVcIiwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgREFHR0VSID0gbmV3IFdlYXBvbihcIkRhZ2dlclwiLCAwLCAxLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBSQVBJRVIgPSBuZXcgV2VhcG9uKFwiUmFwaWVyXCIsIDksIDEsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIENMVUIgPSBuZXcgV2VhcG9uKFwiQ2x1YlwiLCA5LCAxLCAwLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEhBTU1FUiA9IG5ldyBXZWFwb24oXCJIYW1tZXJcIiwgMTAsIDEsIDEsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ1VUTEFTUyA9IG5ldyBXZWFwb24oXCJDdXRsYXNzXCIsIDEwLCAyLCAtMiwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgU0hPUlRTV09SRCA9IG5ldyBXZWFwb24oXCJTaG9ydHN3b3JkXCIsIDExLCAyLCAtMSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTUFDRSA9IG5ldyBXZWFwb24oXCJNYWNlXCIsIDExLCAyLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTTUFMTF9BWCA9IG5ldyBXZWFwb24oXCJTbWFsbCBheFwiLCAxMSwgMSwgMiwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBCUk9BRFNXT1JEID0gbmV3IFdlYXBvbihcIkJyb2Fkc3dvcmRcIiwgMTIsIDIsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIE1PUk5JTkdTVEFSID0gbmV3IFdlYXBvbihcIk1vcm5pbmdzdGFyXCIsIDEzLCAyLCAxLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBUV09fSEFOREVEX1NXT1JEID0gbmV3IFdlYXBvbihcIlR3by1oYW5kZWQgc3dvcmRcIiwgMTQsIDMsIC0xLCBmYWxzZSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJBVFRMRUFYRSA9IG5ldyBXZWFwb24oXCJCYXR0bGVheGVcIiwgMTUsIDMsIDAsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gcG9sZSB3ZWFwb25zXHJcbiAgICBzdGF0aWMgSkFWRUxJTiA9IG5ldyBXZWFwb24oXCJKYXZlbGluXCIsIDksIDEsIC0xLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgU1BFQVIgPSBuZXcgV2VhcG9uKFwiU3BlYXJcIiwgMTEsIDEsIDEsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIEhBTEJFUkQgPSBuZXcgV2VhcG9uKFwiSGFsYmVyZFwiLCAxMywgMiwgLTEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBQSUtFX0FYRSA9IG5ldyBXZWFwb24oXCJQaWtlIGF4ZVwiLCAxNSwgMiwgMiwgZmFsc2UsIHRydWUsIHRydWUpOyAgICAvLyBBbmQgbm93IHJldHVybiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdvcmtlcl9mbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImJ1bmRsZS53b3JrZXIuanNcIik7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjsiLCJpbXBvcnQgeyBzdGFydCwgc3RvcCB9IGZyb20gJy4vY29udHJvbGxlcic7XHJcbmltcG9ydCB7IEhlcm9lc1NpbmdsZXRvbiB9IGZyb20gJy4vbWVsZWUvaGVyb2VzU2luZ2xldG9uJztcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGxpc3Qgb2YgaGVyb2VzIHRvIGJlIHNlbGVjdGVkXHJcbiAqL1xyXG52YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvZXNTZWxlY3RlZFwiKTtcclxudmFyIG9wdCA9IG51bGw7XHJcbnZhciBoZXJvZXNMaXN0SlNPTiA9IEhlcm9lc1NpbmdsZXRvbi5nZXRIZXJvZXNMaXN0SlNPTigpO1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGhlcm9lc0xpc3RKU09OLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgaGVyb0pTT04gPSBoZXJvZXNMaXN0SlNPTltpXTtcclxuICAgIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgb3B0LnZhbHVlID0gaGVyb0pTT04uaWQ7XHJcbiAgICBvcHQuaW5uZXJIVE1MID0gSGVyb2VzU2luZ2xldG9uLmdldE5hbWVGcm9tSUQoaGVyb0pTT04uaWQpO1xyXG4gICAgaWYgKHNlbGVjdCkgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdXAgY29udHJvbGxlciBvcHRpb25zXHJcbiAqL1xyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydFNpbXVsYXRpb24nKTtcclxuaWYgKHN0YXJ0QnV0dG9uKSBzdGFydEJ1dHRvbi5vbmNsaWNrID0gc3RhcnQ7XHJcbmNvbnN0IHN0b3BCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcFNpbXVsYXRpb24nKTtcclxuaWYgKHN0b3BCdXR0b24pIHN0b3BCdXR0b24ub25jbGljayA9IHN0b3A7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==