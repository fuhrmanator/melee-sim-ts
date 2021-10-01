import PrimeWorker from "worker-loader!./worker";

let isPoleWeaponsChargeFirstRoundChecked = false;
let isDefendVsPoleChargeChecked = false;
let isVerboseChecked = false;

let primeWorker: PrimeWorker;

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

export function start(this: GlobalEventHandlers, _ev: MouseEvent) {

    isPoleWeaponsChargeFirstRoundChecked = (document.getElementById("poleWeaponsChargeFirstRound") as HTMLInputElement).checked;
    isDefendVsPoleChargeChecked = (document.getElementById("defendVsPoleCharge") as HTMLInputElement).checked;
    isVerboseChecked = (document.getElementById("verboseOutput") as HTMLInputElement).checked;

    // 'this' is the button that was clicked (onclick)
    let startButton = this as HTMLInputElement;
    startButton.disabled = true;
    let stopButton = document.getElementById("stopSimulation") as HTMLInputElement;
    stopButton.disabled = false;
    let progressBar = document.getElementById("progress");
    if (progressBar) {
        progressBar.style.width = 0 + "%";
        progressBar.style.transition = "none"; // don't use bootstrap animation of progress bar
        //progressBar.classList.add("active"); // turn on animated striped bar
        progressBar.classList.add("progress-bar-animated"); // turn on animated striped bar
    }
    let verboseOutputText = document.getElementById("verboseOutputText") as HTMLTextAreaElement;
    verboseOutputText.value = "";

    /**
     * Clear results from previous run
     */
    clearDiv("heroWins");
    clearDiv("matchupWins");

    //console.log('Starting simulation');
    const hw = document.getElementById("heroWins");
    const mw = document.getElementById("matchupWins");
    let logBuffer = "";
    //console.log(heroSet);

    // crunch the numbers in a web worker
    if (!primeWorker) {
        primeWorker = new PrimeWorker();
        primeWorker.addEventListener("message", function (event) {
            let data = event.data;
            if (!hw || !mw || !progressBar) {
                console.log("couldn't find heroWins or matchupWins or progress bar element on page!")
            }
            else {
                const boutCount: number = parseInt((document.getElementById("boutsPerMatchup") as HTMLInputElement).value);
                const selectElement = document.getElementById("heroesSelected") as HTMLDataListElement;
                const selectedHeroes = getSelectedValues(selectElement);
                //console.log("Web worker messaged me: " + event.data);
                switch (data.cmd) {
                    case 'worker waiting':
                        // give worker the info
                        primeWorker.postMessage({ 'cmd': 'do simulation', 'selectedHeroes': selectedHeroes, 'boutCount': boutCount, 'isPoleWeaponsChargeFirstRound': isPoleWeaponsChargeFirstRoundChecked, 'isDefendVsPoleCharge': isDefendVsPoleChargeChecked, 'isVerbose': isVerboseChecked });
                        let p = document.createElement('p');
                        p.className = "bg-info";
                        p.appendChild(document.createTextNode("Calculating results - please wait."));
                        mw.appendChild(p);
                        p = document.createElement('p');
                        p.className = "bg-info";
                        p.appendChild(document.createTextNode("Calculating results - please wait."));
                        hw.appendChild(p);
                        break;

                    case 'log':
                        logBuffer += data.message + "\n";
                        break;

                    case 'progressUpdate':
                        //progressBar.value = data.progress;
                        const label = Math.round(data.progress / 100) + "%";
                        progressBar.style.width = label;
                        progressBar.innerText = label;
                        //progressBar.setAttribute("aria-valuenow", data.progress);
                        break;

                    case 'finished':
                        progressBar.style.width = "100%";
                        progressBar.innerText = "100%";
                        // progressBar.classList.remove("active"); // stop animated striped bar
                        progressBar.classList.remove("progress-bar-animated"); // stop animated striped bar

                        //console.log(`Finished: received ${data.heroWins}`);
                        /**
                         * Clear messages
                         */
                        clearDiv("heroWins");
                        clearDiv("matchupWins");
                        // let heroWinsTable = createTableFromProperties(data.heroWins, (selectedHeroes.length - 1) * boutCount,
                        //     "Results for " + selectedHeroes.length + " heroes, paired up for " + boutCount + " bouts each", false);
                        //console.log(`got data.heroWinsTableHTML of ${data.heroWinsTableHTML}`)
                        const heroWinsTable = document.createElement("table");
                        // tbl.style.width = "100%";
                        // tbl.className = "sortable table table-striped table-condensed caption-top"; // bootstrap --> class="table table-striped"
                        // // tbl.className = "sortable";  // sorttable.js is the hook
                        // tbl.setAttribute("border", "0");
                        heroWinsTable.style.width = "100%";
                        heroWinsTable.className = "sortable table table-striped table-condensed caption-top";
                        hw.appendChild(heroWinsTable);
                        heroWinsTable.innerHTML = data.heroWinsTableHTML;
                        sorttable.makeSortable(heroWinsTable);

                        // let matchupWinsTable = createTableFromProperties(data.matchupWins, boutCount, "Pairwise results for " + selectedHeroes.length + " heroes, paired up for " + boutCount + " bouts each:", true);
                        //console.log(`got data.matchupWinsTableHTML of ${data.matchupWinsTableHTML}`)
                        const matchupWinsTable = document.createElement("table");
                        matchupWinsTable.style.width = "100%";
                        matchupWinsTable.className = "sortable table table-striped table-condensed caption-top";
                        matchupWinsTable.innerHTML = data.matchupWinsTableHTML;
                        mw.appendChild(matchupWinsTable)
                        sorttable.makeSortable(matchupWinsTable);

                        /**
                         * Force tables to be sorted
                         */
                        let myTH = document.getElementById("matchwins") as HTMLTableCellElement;
                        if (myTH) {
                            sorttable.innerSortFunction.apply(myTH, [myTH]); // once for ascending
                            sorttable.innerSortFunction.apply(myTH, [myTH]); // again for descending (stupid but it's how it works)
                        }
                        myTH = document.getElementById("wins") as HTMLTableCellElement; // top table last, since the icon only shows on last table sorted...
                        if (myTH) {
                            sorttable.innerSortFunction.apply(myTH, [myTH]); // once for ascending
                            sorttable.innerSortFunction.apply(myTH, [myTH]); // again for descending (stupid but it's how it works)
                        }

                        verboseOutputText.value = logBuffer;

                        startButton.disabled = false;
                        stopButton.disabled = true;
                        //progressBar.style.width = "0%";
                        break;

                    default:
                        console.log("Unrecognized message from web worker: ");
                        console.log(data);
                        break;
                }

            }
        });
        primeWorker.addEventListener("error", function () {
            console.log("WORKER ERROR", arguments);
        });
    } else {
        primeWorker.postMessage({ 'cmd': 'wake up' });
    }
    // worker takes over leaving the GUI thread free to update
}

export function stop(this: GlobalEventHandlers, _ev: MouseEvent) {
    /**
     * Stop the web worker
     */
    let stopButton = this as HTMLInputElement;
    stopButton.disabled = true;
    primeWorker.terminate();

    let progressBar = document.getElementById("progress");
    if (progressBar) progressBar.classList.remove("progress-bar-animated"); // stop animated striped bar

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
