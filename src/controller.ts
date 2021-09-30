import PrimeWorker from "worker-loader!./worker";

const worker = new PrimeWorker();

let isPoleWeaponsChargeFirstRoundChecked = false;
let isDefendVsPoleChargeChecked = false;
let isVerboseChecked = false;

//let webWorker: Worker;

function createTableFromProperties(heroWins: {[index: string] : number}, totalCount: number, caption: string, isVersus: boolean) {
    let tbl = document.createElement("table");
    tbl.style.width = "100%";
    tbl.className = "sortable table table-striped table-condensed"; // bootstrap --> class="table table-striped"
    // tbl.className = "sortable";  // sorttable.js is the hook
    tbl.setAttribute("border", "0");
    /**
     * add caption
     */
    let tbcaption = document.createElement('caption');
    tbcaption.appendChild(document.createTextNode(caption));
    tbl.appendChild(tbcaption);
    let tbhead = document.createElement('thead');
    let tr = document.createElement('tr');
    let td = document.createElement('th');
    if (isVersus) {
        td.appendChild(document.createTextNode("Hero 1"));
        tr.appendChild(td);
        td = document.createElement('th');
        td.appendChild(document.createTextNode("vs Hero 2"));
        tr.appendChild(td);
    } else {
        td = document.createElement('th');
        td.appendChild(document.createTextNode("Hero"));
        tr.appendChild(td);
    }
    td = document.createElement('th');
    td.id = (isVersus ? "match" : "") + "wins";
    td.appendChild(document.createTextNode("Wins"));
    // td.setAttribute("align", "right");
    td.style.textAlign = "right";
    tr.appendChild(td);
    td = document.createElement('th');
    td.style.textAlign = "right";
    td.appendChild(document.createTextNode("% total"));
    tr.appendChild(td);
    tbhead.appendChild(tr);
    tbl.appendChild(tbhead);
    let tbdy = document.createElement('tbody');
    let percentageWin = 0;
    for (let property in heroWins) {
        if (heroWins.hasOwnProperty(property)) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            if (isVersus) {
                let heroes = property.split("/");
                td.appendChild(document.createTextNode(heroes[0]));
                tr.appendChild(td);
                td = document.createElement('td');
                td.appendChild(document.createTextNode(heroes[1]));
                tr.appendChild(td);
            } else {
                td.appendChild(document.createTextNode(property));
                tr.appendChild(td);
            }
            // add the column for the number of wins
            td = document.createElement('td');
            td.style.textAlign = "right";
            td.appendChild(document.createTextNode(heroWins[property] + ""));
            tr.appendChild(td);
            td = document.createElement('td');
            td.style.textAlign = "right";
            percentageWin = parseInt(((heroWins[property] / totalCount) * 100).toFixed(2));
            td.appendChild(document.createTextNode("" + percentageWin));
            if (percentageWin > 70) { tr.className = "success"; }
            else if (percentageWin < 30) { tr.className = "danger"; }
            tr.appendChild(td);
            tbdy.appendChild(tr);
        }
    }
    tbl.appendChild(tbdy);
    return tbl;
}

// http://stackoverflow.com/a/5867262/1168342
function getSelectedValues(selectElement: HTMLDataListElement) {
    let result = [];
    let options = selectElement && selectElement.options;
    let opt;

    for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

function clearDiv(id: string) {
    let div = document.getElementById(id) as HTMLDivElement;
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

export function start(this: GlobalEventHandlers, ev: MouseEvent) {
    //let worker = new Worker("../worker/simulator.js");

    worker.addEventListener('message', event => {
        console.log(event.data)
    });

    worker.postMessage('ping');
    worker.postMessage('ping');
    worker.postMessage('ping');

    // isPoleWeaponsChargeFirstRoundChecked = (document.getElementById("poleWeaponsChargeFirstRound") as HTMLInputElement).checked;
    // isDefendVsPoleChargeChecked = (document.getElementById("defendVsPoleCharge") as HTMLInputElement).checked;
    // isVerboseChecked = (document.getElementById("verboseOutput") as HTMLInputElement).checked;

    // // 'this' is the button that was clicked (onclick)
    // let startButton = this as HTMLInputElement;
    // startButton.disabled = true;
    // let stopButton = document.getElementById("stopSimulation") as HTMLInputElement;
    // stopButton.disabled = false;
    // let progressBar = document.getElementById("progress");
    // if (progressBar) {
    //     progressBar.style.width = 0 + "%";
    //     progressBar.style.transition = "none"; // don't use bootstrap animation of progress bar
    //     progressBar.classList.add("active"); // turn on animated striped bar
    // }
    // let verboseOutputText = document.getElementById("verboseOutputText") as HTMLTextAreaElement;
    // verboseOutputText.value = "";

    // /**
    //  * Clear results from previous run
    //  */
    // clearDiv("heroWins");
    // clearDiv("matchupWins");

    // console.log('Starting simulation');
    // let selectElement = document.getElementById("heroesSelected") as HTMLDataListElement;
    // let selectedHeroes = getSelectedValues(selectElement);
    // let logBuffer = "";
    // //console.log(heroSet);

    // let boutCount: number = parseInt((document.getElementById("boutsPerMatchup") as HTMLInputElement).value);

    // // crunch the numbers in a web worker
    // let worker = new Worker("../worker/simulator.js");
    // webWorker = worker;
    // worker.addEventListener("message", function (event) {
    //     let data = event.data;
    //     let hw = document.getElementById("heroWins");
    //     let mw = document.getElementById("matchupWins");
    //     //console.log("Web worker messaged me: " + event.data);
    //     switch (data.cmd) {
    //         case 'worker started':
    //             // give worker the info
    //             worker.postMessage({ 'selectedHeroes': selectedHeroes, 'boutCount': boutCount, 'isPoleWeaponsChargeFirstRound': isPoleWeaponsChargeFirstRoundChecked, 'isDefendVsPoleCharge': isDefendVsPoleChargeChecked, 'isVerbose': isVerboseChecked });
    //             let p = document.createElement('p');
    //             p.className = "bg-info";
    //             p.appendChild(document.createTextNode("Calculating results - please wait."));
    //             if (mw) mw.appendChild(p);
    //             p = document.createElement('p');
    //             p.className = "bg-info";
    //             p.appendChild(document.createTextNode("Calculating results - please wait."));
    //             if (hw) hw.appendChild(p);
    //             break;

    //         case 'log':
    //             logBuffer += data.message + "\n";
    //             break;

    //         case 'progressUpdate':
    //             //progressBar.value = data.progress;
    //             if (progressBar) progressBar.style.width = (data.progress / 100) + "%";
    //             //progressBar.setAttribute("aria-valuenow", data.progress);
    //             break;

    //         case 'finished':
    //             if (progressBar) {
    //                 progressBar.style.width = "100%";
    //                 progressBar.classList.remove("active"); // stop animated striped bar
    //             }

    //             /**
    //              * Clear messages
    //              */
    //             clearDiv("heroWins");
    //             clearDiv("matchupWins");
    //             let heroWinsTable = createTableFromProperties(data.heroWins, (selectedHeroes.length - 1) * boutCount, "Results for " + selectedHeroes.length + " heroes, paired up for " + boutCount + " bouts each", false);
    //             if (hw) hw.appendChild(heroWinsTable);
    //             //makeSortable(heroWinsTable);

    //             let matchupWinsTable = createTableFromProperties(data.matchupWins, boutCount, "Pairwise results for " + selectedHeroes.length + " heroes, paired up for " + boutCount + " bouts each:", true);
    //             if (mw) mw.appendChild(matchupWinsTable);
    //             //makeSortable(matchupWinsTable);

    //             /**
    //              * Force tables to be sorted
    //              */
    //             let myTH = document.getElementById("matchwins");
    //             //innerSortFunction.apply(myTH, [] as unknown as [e:null]); // once for ascending
    //             //innerSortFunction.apply(myTH, [] as unknown as [e:null]); // again for descending (stupid but it's how it works)
    //             myTH = document.getElementById("wins"); // top table last, since the icon only shows on last table sorted...
    //             //innerSortFunction.apply(myTH, [] as unknown as [e:null]);
    //             //innerSortFunction.apply(myTH, [] as unknown as [e:null]);

    //             verboseOutputText.value = logBuffer;

    //             startButton.disabled = false;
    //             stopButton.disabled = true;
    //             break;

    //         default:
    //             console.log("Unrecognized message from web worker: ");
    //             console.log(data);
    //             break;
    //     }
    // });

    // worker.addEventListener("error", function () {
    //     console.log("WORKER ERROR", arguments);
    // });

    // // worker takes over leaving the GUI thread free to update
}

export function stop(this: GlobalEventHandlers, ev: MouseEvent) {
    /**
     * Stop the web worker
     */
    let stopButton = this as HTMLInputElement;
    stopButton.disabled = true;
    worker.terminate();

    let progressBar = document.getElementById("progress");
    if (progressBar) progressBar.classList.remove("active"); // stop animated striped bar

    let mw = document.getElementById("matchupWins");
    let hw = document.getElementById("heroWins");
    /**
     * Clear results from previous run
     */
    clearDiv("heroWins");
    clearDiv("matchupWins");

    let p = document.createElement('p');
    p.className = "bg-warning";
    p.appendChild(document.createTextNode("No results because the simulator was stopped before it finished."));
    if (mw) mw.appendChild(p);
    p = document.createElement('p');
    p.className = "bg-warning";
    p.appendChild(document.createTextNode("No results because the simulator was stopped before it finished."));
    if (hw) hw.appendChild(p);
    (document.getElementById("startSimulation") as HTMLInputElement).disabled = false;
};
