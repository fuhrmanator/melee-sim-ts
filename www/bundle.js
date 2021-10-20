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
var isMute = true;
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
    HeroesSingleton.getMyrmidon = function () {
        return { "id": "069", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD };
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

/***/ "./src/melee/roll.ts":
/*!***************************!*\
  !*** ./src/melee/roll.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roll = void 0;
var die_1 = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
var Roll = /** @class */ (function () {
    function Roll(numberOfDice, _modifier) {
        this._modifier = _modifier;
        this._rolls = Roll.rolled(numberOfDice);
    }
    Object.defineProperty(Roll.prototype, "rolls", {
        get: function () {
            return this._rolls;
        },
        set: function (rolls) {
            this._rolls = rolls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "modifier", {
        get: function () {
            return this._modifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "numberOfDice", {
        get: function () {
            return this._rolls.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "total", {
        get: function () {
            return this._rolls.reduce(function (a, b) { return a + b; }) + (this._modifier || 0);
        },
        enumerable: false,
        configurable: true
    });
    Roll.rolled = function (n) {
        var rolls = [];
        for (var index = 0; index < n; index++) {
            rolls.push((0, die_1.roll)());
        }
        return rolls;
    };
    return Roll;
}());
exports.Roll = Roll;


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
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var roll_1 = __webpack_require__(/*! ../melee/roll */ "./src/melee/roll.ts");
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
        var damage = new roll_1.Roll(this.dice, this.modifier).total;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDOUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUM5RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUM5RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQzlHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNwSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN2SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN4SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3ZILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDN0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM3RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFD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RSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVB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QUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0SSxDQUFDO0lBQUEsQ0FBQztJQUVLLFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsV0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELGFBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxjQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxpQkFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEUsV0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVB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QixHQUFHLENBQUMsU0FBUyxHQUFHLGlDQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxJQUFJLE1BQU07UUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3ZDO0FBRUQ7O0dBRUc7QUFDSCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0QsSUFBSSxXQUFXO0lBQUUsV0FBVyxDQUFDLE9BQU8sR0FBRyxrQkFBSyxDQUFDO0FBQzdDLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM3RCxJQUFJLFVBQVU7SUFBRSxVQUFVLENBQUMsT0FBTyxHQUFHLGlCQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbG9nZ2VyLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9hcm1vci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvZGllLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9oZXJvZXNTaW5nbGV0b24udHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL3JvbGwudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL3NoaWVsZC50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvd2VhcG9uLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy93b3JrZXIvd29ya2VyLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcmltZVdvcmtlciBmcm9tIFwid29ya2VyLWxvYWRlciEuL3dvcmtlci93b3JrZXJcIjtcclxuXHJcbmxldCBpc1BvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZENoZWNrZWQgPSBmYWxzZTtcclxubGV0IGlzRGVmZW5kVnNQb2xlQ2hhcmdlQ2hlY2tlZCA9IGZhbHNlO1xyXG5sZXQgaXNWZXJib3NlQ2hlY2tlZCA9IGZhbHNlO1xyXG5cclxubGV0IHByaW1lV29ya2VyOiBQcmltZVdvcmtlciA9IG5ldyBQcmltZVdvcmtlcigpO1xyXG5cclxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTg2NzI2Mi8xMTY4MzQyXHJcbmZ1bmN0aW9uIGdldFNlbGVjdGVkVmFsdWVzKHNlbGVjdEVsZW1lbnQ6IEhUTUxEYXRhTGlzdEVsZW1lbnQpIHtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIGxldCBvcHRpb25zID0gc2VsZWN0RWxlbWVudCAmJiBzZWxlY3RFbGVtZW50Lm9wdGlvbnM7XHJcbiAgICBsZXQgb3B0O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBpTGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgICBpZiAob3B0LnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9wdC52YWx1ZSB8fCBvcHQudGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXYoaWQ6IHN0cmluZykge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIHdoaWxlIChkaXYuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgIGRpdi5yZW1vdmVDaGlsZChkaXYuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydCh0aGlzOiBHbG9iYWxFdmVudEhhbmRsZXJzLCBfZXY6IE1vdXNlRXZlbnQpIHtcclxuXHJcbiAgICBpc1BvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZENoZWNrZWQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmRcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuICAgIGlzRGVmZW5kVnNQb2xlQ2hhcmdlQ2hlY2tlZCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmVuZFZzUG9sZUNoYXJnZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG4gICAgaXNWZXJib3NlQ2hlY2tlZCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZlcmJvc2VPdXRwdXRcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuXHJcbiAgICAvLyAndGhpcycgaXMgdGhlIGJ1dHRvbiB0aGF0IHdhcyBjbGlja2VkIChvbmNsaWNrKVxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gdGhpcyBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgbGV0IHN0b3BCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3BTaW11bGF0aW9uXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBzdG9wQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2dyZXNzXCIpO1xyXG4gICAgaWYgKHByb2dyZXNzQmFyKSB7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAwICsgXCIlXCI7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiOyAvLyBkb24ndCB1c2UgYm9vdHN0cmFwIGFuaW1hdGlvbiBvZiBwcm9ncmVzcyBiYXJcclxuICAgICAgICAvL3Byb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIHR1cm4gb24gYW5pbWF0ZWQgc3RyaXBlZCBiYXJcclxuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwicHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIpOyAvLyB0dXJuIG9uIGFuaW1hdGVkIHN0cmlwZWQgYmFyXHJcbiAgICB9XHJcbiAgICBsZXQgdmVyYm9zZU91dHB1dFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZlcmJvc2VPdXRwdXRUZXh0XCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICB2ZXJib3NlT3V0cHV0VGV4dC52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciByZXN1bHRzIGZyb20gcHJldmlvdXMgcnVuXHJcbiAgICAgKi9cclxuICAgIGNsZWFyRGl2KFwiaGVyb1dpbnNcIik7XHJcbiAgICBjbGVhckRpdihcIm1hdGNodXBXaW5zXCIpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ1N0YXJ0aW5nIHNpbXVsYXRpb24nKTtcclxuICAgIGNvbnN0IGh3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvV2luc1wiKTtcclxuICAgIGNvbnN0IG13ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXRjaHVwV2luc1wiKTtcclxuICAgIGxldCBsb2dCdWZmZXIgPSBcIlwiO1xyXG4gICAgaWYgKGh3ICYmIG13ICYmIHByb2dyZXNzQmFyKSB7XHJcbiAgICAgICAgcHJpbWVXb3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiV2ViIHdvcmtlciBtZXNzYWdlZCBtZTogXCIgKyBldmVudC5kYXRhKTtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmNtZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbG9nJzpcclxuICAgICAgICAgICAgICAgICAgICBsb2dCdWZmZXIgKz0gZGF0YS5tZXNzYWdlICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdwcm9ncmVzc1VwZGF0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9ncmVzc0Jhci52YWx1ZSA9IGRhdGEucHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKGRhdGEucHJvZ3Jlc3MgLyAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gcHJvZ3Jlc3MgKyBcIiVcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBsYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5pbm5lclRleHQgPSBsYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLmlubmVyVGV4dCA9IFwiQ3JlYXRpbmcgZmluYWwgcmVzdWx0cy4uLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbmlzaGVkJzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJUZXh0ID0gXCJTZWUgcmVzdWx0cyBiZWxvdy5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZShcInByb2dyZXNzLWJhci1hbmltYXRlZFwiKTsgLy8gc3RvcCBhbmltYXRlZCBzdHJpcGVkIGJhclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwiYmctaW5mb1wiKTsgLy8gc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwiYmctc3VjY2Vzc1wiKTsgLy9cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYEZpbmlzaGVkOiByZWNlaXZlZCAke2RhdGEuaGVyb1dpbnN9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogQ2xlYXIgbWVzc2FnZXNcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBjbGVhckRpdihcImhlcm9XaW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRGl2KFwibWF0Y2h1cFdpbnNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVyb1dpbnNUYWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBoZXJvV2luc1RhYmxlLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVyb1dpbnNUYWJsZS5jbGFzc05hbWUgPSBcInNvcnRhYmxlIHRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtY29uZGVuc2VkIGNhcHRpb24tdG9wXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaHcuYXBwZW5kQ2hpbGQoaGVyb1dpbnNUYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVyb1dpbnNUYWJsZS5pbm5lckhUTUwgPSBkYXRhLmhlcm9XaW5zVGFibGVIVE1MO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5tYWtlU29ydGFibGUoaGVyb1dpbnNUYWJsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNodXBXaW5zVGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2h1cFdpbnNUYWJsZS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zVGFibGUuY2xhc3NOYW1lID0gXCJzb3J0YWJsZSB0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWNvbmRlbnNlZCBjYXB0aW9uLXRvcFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zVGFibGUuaW5uZXJIVE1MID0gZGF0YS5tYXRjaHVwV2luc1RhYmxlSFRNTDtcclxuICAgICAgICAgICAgICAgICAgICBtdy5hcHBlbmRDaGlsZChtYXRjaHVwV2luc1RhYmxlKVxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5tYWtlU29ydGFibGUobWF0Y2h1cFdpbnNUYWJsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEZvcmNlIHRhYmxlcyB0byBiZSBzb3J0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbXlUSCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF0Y2h3aW5zXCIpIGFzIEhUTUxUYWJsZUNlbGxFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChteVRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBvbmNlIGZvciBhc2NlbmRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydHRhYmxlLmlubmVyU29ydEZ1bmN0aW9uLmFwcGx5KG15VEgsIFtteVRIXSk7IC8vIGFnYWluIGZvciBkZXNjZW5kaW5nIChzdHVwaWQgYnV0IGl0J3MgaG93IGl0IHdvcmtzKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBteVRIID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5zXCIpIGFzIEhUTUxUYWJsZUNlbGxFbGVtZW50OyAvLyB0b3AgdGFibGUgbGFzdCwgc2luY2UgdGhlIGljb24gb25seSBzaG93cyBvbiBsYXN0IHRhYmxlIHNvcnRlZC4uLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChteVRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnR0YWJsZS5pbm5lclNvcnRGdW5jdGlvbi5hcHBseShteVRILCBbbXlUSF0pOyAvLyBvbmNlIGZvciBhc2NlbmRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydHRhYmxlLmlubmVyU29ydEZ1bmN0aW9uLmFwcGx5KG15VEgsIFtteVRIXSk7IC8vIGFnYWluIGZvciBkZXNjZW5kaW5nIChzdHVwaWQgYnV0IGl0J3MgaG93IGl0IHdvcmtzKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTG9nOlxcbiR7bG9nQnVmZmVyfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcmJvc2VPdXRwdXRUZXh0LnZhbHVlID0gbG9nQnVmZmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3BCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbnJlY29nbml6ZWQgbWVzc2FnZSBmcm9tIHdlYiB3b3JrZXI6IFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpbWVXb3JrZXIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJXT1JLRVIgRVJST1JcIiwgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNZXNzYWdlIHRoZSB3b3JrZXIgdG8gZG8gdGhlIHNpbXVsYXRpb25cclxuICAgICAgICBjb25zdCBib3V0Q291bnQ6IG51bWJlciA9IHBhcnNlSW50KChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvdXRzUGVyTWF0Y2h1cFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVyb2VzU2VsZWN0ZWRcIikgYXMgSFRNTERhdGFMaXN0RWxlbWVudDtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEhlcm9lcyA9IGdldFNlbGVjdGVkVmFsdWVzKHNlbGVjdEVsZW1lbnQpO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJiZy1zdWNjZXNzXCIpOyAvLyBpbmZvXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZShcImJnLXdhcm5pbmdcIik7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImJnLWluZm9cIik7XHJcblxyXG4gICAgICAgIC8vIGdpdmUgd29ya2VyIHRoZSBpbmZvXHJcbiAgICAgICAgcHJpbWVXb3JrZXIucG9zdE1lc3NhZ2UoeyAnY21kJzogJ2RvIHNpbXVsYXRpb24nLCAnc2VsZWN0ZWRIZXJvZXMnOiBzZWxlY3RlZEhlcm9lcywgJ2JvdXRDb3VudCc6IGJvdXRDb3VudCwgJ2lzUG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kJzogaXNQb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmRDaGVja2VkLCAnaXNEZWZlbmRWc1BvbGVDaGFyZ2UnOiBpc0RlZmVuZFZzUG9sZUNoYXJnZUNoZWNrZWQsICdpc1ZlcmJvc2UnOiBpc1ZlcmJvc2VDaGVja2VkIH0pO1xyXG4gICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIHAuY2xhc3NOYW1lID0gXCJiZy1pbmZvXCI7XHJcbiAgICAgICAgcC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkNhbGN1bGF0aW5nIHJlc3VsdHMgLSBwbGVhc2Ugd2FpdC5cIikpO1xyXG4gICAgICAgIG13LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgcC5jbGFzc05hbWUgPSBcImJnLWluZm9cIjtcclxuICAgICAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiQ2FsY3VsYXRpbmcgcmVzdWx0cyAtIHBsZWFzZSB3YWl0LlwiKSk7XHJcbiAgICAgICAgaHcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY291bGRuJ3QgZmluZCBoZXJvV2lucyBvciBtYXRjaHVwV2lucyBvciBwcm9ncmVzcyBiYXIgZWxlbWVudCBvbiBwYWdlIVwiKVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdG9wKHRoaXM6IEdsb2JhbEV2ZW50SGFuZGxlcnMsIF9ldjogTW91c2VFdmVudCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9wIHRoZSB3ZWIgd29ya2VyXHJcbiAgICAgKi9cclxuICAgIGxldCBzdG9wQnV0dG9uID0gdGhpcyBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc3RvcEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBwcmltZVdvcmtlci50ZXJtaW5hdGUoKTtcclxuICAgIHByaW1lV29ya2VyID0gbmV3IFByaW1lV29ya2VyKCk7XHJcblxyXG4gICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9ncmVzc1wiKTtcclxuICAgIGlmIChwcm9ncmVzc0Jhcikge1xyXG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIik7IC8vIHN0b3AgYW5pbWF0ZWQgc3RyaXBlZCBiYXJcclxuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwiYmctaW5mb1wiKTsgLy8gc2hvdyBhIHdhcm5pbmdcclxuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwiYmctd2FybmluZ1wiKTtcclxuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lclRleHQgPSBcIkNhbmNlbGVkIGF0IFwiICsgcHJvZ3Jlc3NCYXIuaW5uZXJUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF0Y2h1cFdpbnNcIik7XHJcbiAgICBsZXQgaHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlcm9XaW5zXCIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciByZXN1bHRzIGZyb20gcHJldmlvdXMgcnVuXHJcbiAgICAgKi9cclxuICAgIGNsZWFyRGl2KFwiaGVyb1dpbnNcIik7XHJcbiAgICBjbGVhckRpdihcIm1hdGNodXBXaW5zXCIpO1xyXG5cclxuICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgcC5jbGFzc05hbWUgPSBcImJnLXdhcm5pbmdcIjtcclxuICAgIHAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJObyByZXN1bHRzIGJlY2F1c2UgdGhlIHNpbXVsYXRvciB3YXMgc3RvcHBlZCBiZWZvcmUgaXQgZmluaXNoZWQuXCIpKTtcclxuICAgIGlmIChtdykgbXcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgcC5jbGFzc05hbWUgPSBcImJnLXdhcm5pbmdcIjtcclxuICAgIHAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJObyByZXN1bHRzIGJlY2F1c2UgdGhlIHNpbXVsYXRvciB3YXMgc3RvcHBlZCBiZWZvcmUgaXQgZmluaXNoZWQuXCIpKTtcclxuICAgIGlmIChodykgaHcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFNpbXVsYXRpb25cIikgYXMgSFRNTElucHV0RWxlbWVudCkuZGlzYWJsZWQgPSBmYWxzZTtcclxufTtcclxuIiwibGV0IGlzTXV0ZSA9IHRydWU7XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAvLyBpZiAoIWlzTXV0ZSkgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICBpZiAoIWlzTXV0ZSkgcG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcImxvZ1wiLCBcIm1lc3NhZ2VcIjogbWVzc2FnZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE11dGUoY2hhbmdlSXNNdXRlOiBib29sZWFuKSB7XHJcbiAgICBpc011dGUgPSBjaGFuZ2VJc011dGU7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEFybW9yIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGhpdHNTdG9wcGVkOiBudW1iZXI7XHJcbiAgICBtYUFkajogbnVtYmVyO1xyXG4gICAgZHhBZGo6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaGl0c1N0b3BwZWQ6IG51bWJlciwgbWFBZGo6IG51bWJlciwgZHhBZGo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5oaXRzU3RvcHBlZCA9IGhpdHNTdG9wcGVkO1xyXG4gICAgICAgIHRoaXMubWFBZGogPSBtYUFkajtcclxuICAgICAgICB0aGlzLmR4QWRqID0gZHhBZGo7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgTk9fQVJNT1IgPSBuZXcgQXJtb3IoXCJObyBhcm1vclwiLCAwLCAwLCAwKTtcclxuICAgIHN0YXRpYyBMRUFUSEVSID0gbmV3IEFybW9yKFwiTGVhdGhlclwiLCAyLCAyLCAyKTtcclxuICAgIHN0YXRpYyBDSEFJTiA9IG5ldyBBcm1vcihcIkNoYWluXCIsIDMsIDQsIDQpO1xyXG4gICAgc3RhdGljIFBMQVRFID0gbmV3IEFybW9yKFwiUGxhdGVcIiwgNSwgNiwgNik7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsKCkge1xyXG4gICAgY29uc3Qgcm9sbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYgKyAxKTtcclxuICAgIGxvZyhgRGllIHJvbGw6ICR7cm9sbH1gKTtcclxuICAgIHJldHVybiByb2xsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbERpY2UobnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGljZTsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IHJvbGwoKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsVGhyZWVEaWNlKCkge1xyXG4gICAgcmV0dXJuIHJvbGxEaWNlKDMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbEZvdXJEaWNlKCkge1xyXG4gICAgcmV0dXJuIHJvbGxEaWNlKDQpO1xyXG59IiwiaW1wb3J0IHsgV2VhcG9uIH0gZnJvbSBcIi4vd2VhcG9uXCI7XHJcbmltcG9ydCB7IEFybW9yIH0gZnJvbSBcIi4vYXJtb3JcIjtcclxuaW1wb3J0IHsgU2hpZWxkIH0gZnJvbSBcIi4vc2hpZWxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhlcm9EZXNjcmlwdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgc3Q6IG51bWJlcjtcclxuICAgIGR4OiBudW1iZXI7XHJcbiAgICB3ZWFwb246IFdlYXBvbjtcclxuICAgIGFybW9yOiBBcm1vcjtcclxuICAgIHNoaWVsZDogU2hpZWxkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGVyb2VzU2luZ2xldG9uIHtcclxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk3NTM4NDEvMTE2ODM0MlxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbGlzdEhlaWdodCA9IDE1O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVyb2VzTGlzdEpTT046IEFycmF5PEhlcm9EZXNjcmlwdGlvbj4gPVxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDAxXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDJcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDAzXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDRcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwNVwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA2XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwN1wiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA4XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDlcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEzXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTRcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE1XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTZcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxN1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxOFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE5XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIxXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjNcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjRcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjVcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjZcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyN1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyOFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyOVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzMFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMxXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMzXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM0XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzVcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzZcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzdcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzhcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzOVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDJcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDNcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ0XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0NVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDZcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDdcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ4XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0OVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTBcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTFcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUyXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1M1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTRcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTVcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU2XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1N1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNThcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTlcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYwXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2MVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjJcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjNcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY0XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2NVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY2XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2N1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY4XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjlcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcwXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcxXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3MlwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzNcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc0XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc1XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3NlwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzdcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3OFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzlcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4MFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgxXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODJcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgzXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODRcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NVwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODZcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODdcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg4XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4OVwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTBcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTFcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkyXCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5M1wiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk0XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5NVwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk2XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTdcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk4XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk5XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMFwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDFcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMlwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDNcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwNFwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA1XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwNlwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwN1wiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDhcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfVxyXG4gICAgICAgIF07XHJcbiAgICBzdGF0aWMgZ2V0SGVyb2VzTGlzdEpTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlcm9lc1NpbmdsZXRvbi5oZXJvZXNMaXN0SlNPTjtcclxuICAgIH07XHJcbiAgICBzdGF0aWMgZ2V0TGlzdEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gSGVyb2VzU2luZ2xldG9uLmxpc3RIZWlnaHQ7XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGdldE5hbWVGcm9tSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGhlcm8gPSB0aGlzLmhlcm9lc0xpc3RKU09OLmZpbmQoaGVybyA9PiBoZXJvLmlkID09IGlkKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gaGVybyA/IGAke2hlcm8uaWR9OlNUJHtoZXJvLnN0fTtEWCR7aGVyby5keH07JHtoZXJvLndlYXBvbi5uYW1lfTske2hlcm8uYXJtb3IubmFtZX07JHtoZXJvLnNoaWVsZC5uYW1lfWAudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bIC1dL2csICdfJykgOiBgKGhlcm8gaWQgJHtpZH0gbm90IGZvdW5kKWA7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0TXlybWlkb24oKTogSGVyb0Rlc2NyaXB0aW9uIHtcclxuICAgICAgICByZXR1cm4geyBcImlkXCI6IFwiMDY5XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbCB9IGZyb20gXCIuL2RpZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvbGwge1xyXG4gICAgcHJpdmF0ZSBfcm9sbHM6IG51bWJlcltdO1xyXG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZEaWNlOiBudW1iZXIsIHByaXZhdGUgX21vZGlmaWVyPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcm9sbHMgPSBSb2xsLnJvbGxlZChudW1iZXJPZkRpY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm9sbHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm9sbHMocm9sbHM6IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5fcm9sbHMgPSByb2xscztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1vZGlmaWVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RpZmllcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG51bWJlck9mRGljZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9sbHMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdG90YWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvbGxzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpICsgKHRoaXMuX21vZGlmaWVyIHx8IDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcm9sbGVkKG46IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHJvbGxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBuOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHJvbGxzLnB1c2gocm9sbCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm9sbHM7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFNoaWVsZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBoaXRzU3RvcHBlZDogbnVtYmVyO1xyXG4gICAgZHhBZGo6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaGl0c1N0b3BwZWQ6IG51bWJlciwgZHhBZGo6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmhpdHNTdG9wcGVkID0gaGl0c1N0b3BwZWQ7XHJcbiAgICAgICAgdGhpcy5keEFkaiA9IGR4QWRqO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIE5PX1NISUVMRCA9IG5ldyBTaGllbGQoXCJObyBzaGllbGRcIiwgMCwgMCk7XHJcbiAgICBzdGF0aWMgU01BTExfU0hJRUxEID0gbmV3IFNoaWVsZChcIlNtYWxsIHNoaWVsZFwiLCAxLCAwKTtcclxuICAgIHN0YXRpYyBMQVJHRV9TSElFTEQgPSBuZXcgU2hpZWxkKFwiTGFyZ2Ugc2hpZWxkXCIsIDIsIDEpO1xyXG59XHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgUm9sbCB9IGZyb20gXCIuLi9tZWxlZS9yb2xsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VhcG9uIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHN0OiBudW1iZXI7XHJcbiAgICBkaWNlOiBudW1iZXI7XHJcbiAgICBtb2RpZmllcjogbnVtYmVyO1xyXG4gICAgaXNUd29IYW5kZWQ6IGJvb2xlYW47XHJcbiAgICBpc1Rocm93bjogYm9vbGVhbjtcclxuICAgIGlzUG9sZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3Q6IG51bWJlcixcclxuICAgICAgICBkaWNlOiBudW1iZXIsXHJcbiAgICAgICAgbW9kaWZpZXI6IG51bWJlcixcclxuICAgICAgICBpc1R3b0hhbmRlZDogYm9vbGVhbixcclxuICAgICAgICBpc1Rocm93bjogYm9vbGVhbixcclxuICAgICAgICBpc1BvbGU6IGJvb2xlYW4sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3QgPSBzdDtcclxuICAgICAgICB0aGlzLmRpY2UgPSBkaWNlO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZXIgPSBtb2RpZmllcjtcclxuICAgICAgICB0aGlzLmlzVHdvSGFuZGVkID0gaXNUd29IYW5kZWQ7XHJcbiAgICAgICAgdGhpcy5pc1BvbGUgPSBpc1BvbGU7XHJcbiAgICAgICAgdGhpcy5pc1Rocm93biA9IGlzVGhyb3duO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb0RhbWFnZSgpIHtcclxuICAgICAgICBsb2coXHJcbiAgICAgICAgICAgIFwiUm9sbGluZyBmb3Igd2VhcG9uIGRvaW5nIFwiXHJcbiAgICAgICAgICAgICsgdGhpcy5kaWNlXHJcbiAgICAgICAgICAgICsgXCJkXCJcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIilcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgXCIgZGFtYWdlLlwiKTtcclxuICAgICAgICBsZXQgZGFtYWdlID0gbmV3IFJvbGwodGhpcy5kaWNlLCB0aGlzLm1vZGlmaWVyKS50b3RhbDtcclxuICAgICAgICBpZiAodGhpcy5tb2RpZmllciAhPT0gMCkgbG9nKCgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArIHRoaXMubW9kaWZpZXIpO1xyXG4gICAgICAgIGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG4gICAgICAgIGxvZyhgVG90YWwgd2VhcG9uIGRhbWFnZTogJHtkYW1hZ2V9YCk7XHJcbiAgICAgICAgcmV0dXJuIGRhbWFnZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiAoXCIgKyB0aGlzLmRpY2UgKyBcIkRcIiArICgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArICgodGhpcy5tb2RpZmllciAhPT0gMCkgPyB0aGlzLm1vZGlmaWVyIDogXCJcIikgKyBcIilcIjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIE5PTkUgPSBuZXcgV2VhcG9uKFwiTm9uZVwiLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBEQUdHRVIgPSBuZXcgV2VhcG9uKFwiRGFnZ2VyXCIsIDAsIDEsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFJBUElFUiA9IG5ldyBXZWFwb24oXCJSYXBpZXJcIiwgOSwgMSwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ0xVQiA9IG5ldyBXZWFwb24oXCJDbHViXCIsIDksIDEsIDAsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgSEFNTUVSID0gbmV3IFdlYXBvbihcIkhhbW1lclwiLCAxMCwgMSwgMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBDVVRMQVNTID0gbmV3IFdlYXBvbihcIkN1dGxhc3NcIiwgMTAsIDIsIC0yLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTSE9SVFNXT1JEID0gbmV3IFdlYXBvbihcIlNob3J0c3dvcmRcIiwgMTEsIDIsIC0xLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBNQUNFID0gbmV3IFdlYXBvbihcIk1hY2VcIiwgMTEsIDIsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFNNQUxMX0FYID0gbmV3IFdlYXBvbihcIlNtYWxsIGF4XCIsIDExLCAxLCAyLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJST0FEU1dPUkQgPSBuZXcgV2VhcG9uKFwiQnJvYWRzd29yZFwiLCAxMiwgMiwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTU9STklOR1NUQVIgPSBuZXcgV2VhcG9uKFwiTW9ybmluZ3N0YXJcIiwgMTMsIDIsIDEsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFRXT19IQU5ERURfU1dPUkQgPSBuZXcgV2VhcG9uKFwiVHdvLWhhbmRlZCBzd29yZFwiLCAxNCwgMywgLTEsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQkFUVExFQVhFID0gbmV3IFdlYXBvbihcIkJhdHRsZWF4ZVwiLCAxNSwgMywgMCwgZmFsc2UsIHRydWUsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBwb2xlIHdlYXBvbnNcclxuICAgIHN0YXRpYyBKQVZFTElOID0gbmV3IFdlYXBvbihcIkphdmVsaW5cIiwgOSwgMSwgLTEsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBTUEVBUiA9IG5ldyBXZWFwb24oXCJTcGVhclwiLCAxMSwgMSwgMSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgSEFMQkVSRCA9IG5ldyBXZWFwb24oXCJIYWxiZXJkXCIsIDEzLCAyLCAtMSwgZmFsc2UsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIFBJS0VfQVhFID0gbmV3IFdlYXBvbihcIlBpa2UgYXhlXCIsIDE1LCAyLCAyLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7ICAgIC8vIEFuZCBub3cgcmV0dXJuIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG5cclxufVxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV29ya2VyX2ZuKCkge1xuICByZXR1cm4gbmV3IFdvcmtlcihfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYnVuZGxlLndvcmtlci5qc1wiKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiOyIsImltcG9ydCB7IHN0YXJ0LCBzdG9wIH0gZnJvbSAnLi9jb250cm9sbGVyJztcclxuaW1wb3J0IHsgSGVyb2VzU2luZ2xldG9uIH0gZnJvbSAnLi9tZWxlZS9oZXJvZXNTaW5nbGV0b24nO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgbGlzdCBvZiBoZXJvZXMgdG8gYmUgc2VsZWN0ZWRcclxuICovXHJcbnZhciBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlcm9lc1NlbGVjdGVkXCIpO1xyXG52YXIgb3B0ID0gbnVsbDtcclxudmFyIGhlcm9lc0xpc3RKU09OID0gSGVyb2VzU2luZ2xldG9uLmdldEhlcm9lc0xpc3RKU09OKCk7XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgaGVyb2VzTGlzdEpTT04ubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBoZXJvSlNPTiA9IGhlcm9lc0xpc3RKU09OW2ldO1xyXG4gICAgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHQudmFsdWUgPSBoZXJvSlNPTi5pZDtcclxuICAgIG9wdC5pbm5lckhUTUwgPSBIZXJvZXNTaW5nbGV0b24uZ2V0TmFtZUZyb21JRChoZXJvSlNPTi5pZCk7XHJcbiAgICBpZiAoc2VsZWN0KSBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB1cCBjb250cm9sbGVyIG9wdGlvbnNcclxuICovXHJcbmNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0U2ltdWxhdGlvbicpO1xyXG5pZiAoc3RhcnRCdXR0b24pIHN0YXJ0QnV0dG9uLm9uY2xpY2sgPSBzdGFydDtcclxuY29uc3Qgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9wU2ltdWxhdGlvbicpO1xyXG5pZiAoc3RvcEJ1dHRvbikgc3RvcEJ1dHRvbi5vbmNsaWNrID0gc3RvcDtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9