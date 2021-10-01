import { Game } from "../melee/game";
import { Hero } from "../melee/hero";
import { log, setMute } from "../logger";

const ctx: Worker = self as any;

let poleWeaponsChargeFirstRound = false;
let defendVsPoleCharge = false;

ctx.postMessage({ "cmd": "worker waiting" });

ctx.addEventListener('message', function (event: any) {
    /**
     * parse the message
     */
    const data = event.data;
    console.log(`Worker: got message ${data.cmd}`);
    switch (data.cmd) {
        case "wake up":
            ctx.postMessage({ "cmd": "worker waiting" });
            break;

        default:
            const heroSet = new Array<Hero>();  // list of heroes to fight

            Game.createHeroesMap();
            let completeHeroMap = Game.getHeroMap();
            data.selectedHeroes.forEach(function (heroName: string) {
                let hero = completeHeroMap.get(heroName);
                if (hero) heroSet.push(hero);
            }, this);

            /**
             * Configure simulator options
             */
            setMute(!data.isVerbose);
            poleWeaponsChargeFirstRound = data.isPoleWeaponsChargeFirstRound;
            defendVsPoleCharge = data.isDefendVsPoleCharge;

            tryAllCombinations(heroSet, data.boutCount);
            break;
    }
});

function tryAllCombinations(heroSet: Array<Hero>, boutCount: number) {
    let matchupWins: { [index: string]: number } = {};  // map of hero and integer
    let heroWins: { [index: string]: number } = {};
    let game = null;
    let score = [2];
    let progress = 0;
    // how many bouts total is N * N-1 * boutCount
    let totalIterations = heroSet.length * (heroSet.length - 1) * boutCount / 2;
    let iterationCount = 0;
    heroSet.forEach(function (hero1) {
        heroWins[hero1.name] = 0;
        heroSet.forEach(hero2 => {
            if (hero1 !== hero2) matchupWins[hero1.name + "/" + hero2.name] = 0;
        });
    });
    let lastUpdateTime = new Date(); // for throttling updates

    for (let h1 = 0; h1 < heroSet.length; h1++) {
        let hero1 = heroSet[h1];
        let h2 = 0;
        let hero2 = heroSet[h2];

        for (h2 = h1 + 1; h2 < heroSet.length; h2++) {
            hero2 = heroSet[h2];
            let sumRounds = 0;
            score[0] = 0;
            score[1] = 0;
            log('Matchup: ' + hero1.name + ' vs. ' + hero2.name);

            for (let bout = 0; bout < boutCount; bout++) {
                log("Bout: " + bout + 1 + " of " + boutCount);
                iterationCount++;
                /**
                 * Don't post updates too often
                 */
                let currentTime = new Date();
                if (currentTime.getTime() - lastUpdateTime.getTime() > 500) {
                    /**
                     * update progress bar on page (assumes max is 10000)
                     */
                    progress = Math.ceil((iterationCount / totalIterations) * 100 * 100);
                    ctx.postMessage({ "cmd": "progressUpdate", "progress": progress });
                    lastUpdateTime = currentTime;
                }

                // clone heroes (resets them) prior to fighting
                let fightingHero1 = Object.create(hero1);
                let fightingHero2 = Object.create(hero2);
                game = new Game(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
                let winningFighter = game.fightToTheDeath();

                if (winningFighter !== null) {
                    let losingFighter = (winningFighter === fightingHero1 ? fightingHero2 : fightingHero1);
                    if (winningFighter === fightingHero1) {
                        score[0]++;
                    } else {
                        score[1]++;
                    }
                    const key = winningFighter.name + "/" + losingFighter.name;
                    matchupWins[key]++;
                }
                sumRounds += game.round;
            }
            /**
             * Update the total stats for these heroes
             */
            heroWins[hero1.name] += score[0];
            heroWins[hero2.name] += score[1];
        }

    }
    /**
     * Put stats back on page
     */
    ctx.postMessage({ "cmd": "progressUpdate", "progress": 100*100 });
    console.log(`Creating tables in worker...`);
    const heroWinsTableHTML = createTableFromProperties(heroWins, (heroSet.length - 1) * boutCount,
        `Results for ${heroSet.length} heroes, paired up for ${boutCount} bouts each:`, false);
    const matchupWinsTableHTML: string = createTableFromProperties(matchupWins, boutCount,
        `Pairwise results for ${heroSet.length} heroes, paired up for ${boutCount} bouts each:`, true);
    ctx.postMessage({
        "cmd": "finished",
        "heroWins": heroWins,
        "matchupWins": matchupWins,
        "heroWinsTableHTML": heroWinsTableHTML,
        "matchupWinsTableHTML": matchupWinsTableHTML
    });
}

function createTableFromProperties(heroWins: { [index: string]: number }, totalCount: number, caption: string, isVersus: boolean): string {
    // tbl.style.width = "100%";
    // tbl.className = "sortable table table-striped table-condensed caption-top"; // bootstrap --> class="table table-striped"
    // // tbl.className = "sortable";  // sorttable.js is the hook
    // tbl.setAttribute("border", "0");

    // <caption>Results for 2 heroes, paired up for 2 bouts each</caption><thead><tr><th class="">Hero</th><th id="wins" class=" sorttable_sorted_reverse" style="text-align: right;">Wins<span id="sorttable_sortrevind">&nbsp;▴</span></th><th class="" style="text-align: right;">% total</th></tr></thead><tbody><tr class="success"><td>006:ST8;DX16;DAGGER;LEATHER;LARGE_SHIELD</td><td style="text-align: right;">2</td><td style="text-align: right;">100</td></tr><tr class="danger"><td>005:ST8;DX16;DAGGER;NO_ARMOR;LARGE_SHIELD</td><td style="text-align: right;">0</td><td style="text-align: right;">0</td></tr></tbody><tfoot></tfoot></table>

    // /**
    //  * add caption
    //  */
    // let tbcaption = document.createElement('caption');
    // tbcaption.appendChild(document.createTextNode(caption));
    // tbl.appendChild(tbcaption);
    // let tbhead = document.createElement('thead');
    // let tr = document.createElement('tr');
    // let td = document.createElement('th');
    let html = `<caption>${caption}</caption><thead>`;
    // if (isVersus) {
    //     td.appendChild(document.createTextNode("Hero 1"));
    //     tr.appendChild(td);
    //     td = document.createElement('th');
    //     td.appendChild(document.createTextNode("vs Hero 2"));
    //     tr.appendChild(td);
    // } else {
    //     td = document.createElement('th');
    //     td.appendChild(document.createTextNode("Hero"));
    //     tr.appendChild(td);
    // }
    if (isVersus) {
        html += `<tr><th>Hero 1</th><th>vs Hero 2</th>`
    } else {
        html += `<tr><th>Hero</th>`
    }
    // td = document.createElement('th');
    // td.id = (isVersus ? "match" : "") + "wins";
    // td.appendChild(document.createTextNode("Wins"));
    // // td.setAttribute("align", "right");
    // td.style.textAlign = "right";
    // tr.appendChild(td);
    // td = document.createElement('th');
    // td.style.textAlign = "right";
    // td.appendChild(document.createTextNode("% total"));
    // tr.appendChild(td);
    // tbhead.appendChild(tr);
    // tbl.appendChild(tbhead);
    html += `<th id="${isVersus ? 'match' : ''}wins" style="text-align: right;">Wins</th><th class="" style="text-align: right;">% total</th></tr></thead>`;
    // let tbdy = document.createElement('tbody');
    // let percentageWin = 0;
    // for (let property in heroWins) {
    //     if (heroWins.hasOwnProperty(property)) {
    let tbody = '';
    let percentageWin = 0;
    let pctClass: string;
    for (let property in heroWins) {
        if (heroWins.hasOwnProperty(property)) {
            percentageWin = parseInt(((heroWins[property] / totalCount) * 100).toFixed(2));
            pctClass = '';
            if (percentageWin > 70)
                pctClass = ` class="alert-success"`;
            else if (percentageWin < 30)
                pctClass = ` class="alert-danger"`;
            tbody += `<tr${pctClass}>`;
            if (isVersus) {
                let heroes = property.split("/");
                tbody += `<td>${heroes[0]}</td><td>${heroes[1]}</td>`;
            } else {
                tbody += `<td>${property}</td>`
            }
            //         tr = document.createElement('tr');
            //         td = document.createElement('td');
            //         if (isVersus) {
            //             let heroes = property.split("/");
            //             td.appendChild(document.createTextNode(heroes[0]));
            //             tr.appendChild(td);
            //             td = document.createElement('td');
            //             td.appendChild(document.createTextNode(heroes[1]));
            //             tr.appendChild(td);
            //         } else {
            //             td.appendChild(document.createTextNode(property));
            //             tr.appendChild(td);
            //         }
            //         // add the column for the number of wins
            //         td = document.createElement('td');
            //         td.style.textAlign = "right";
            //         td.appendChild(document.createTextNode(heroWins[property] + ""));
            //         tr.appendChild(td);
            tbody += `<td style="text-align: right;">${heroWins[property]}</td>`
            //         td = document.createElement('td');
            //         td.style.textAlign = "right";
            //         percentageWin = parseInt(((heroWins[property] / totalCount) * 100).toFixed(2));
            //         td.appendChild(document.createTextNode("" + percentageWin));
            tbody += `<td style="text-align: right;">${percentageWin}</td></tr>`
            //         if (percentageWin > 70) { tr.className = "success"; }
            //         else if (percentageWin < 30) { tr.className = "danger"; }
            //         tr.appendChild(td);
            //         tbdy.appendChild(tr);
            //     }
        }
    }
    // }
    html += `<tbody>${tbody}</tbody>`;
    // tbl.appendChild(tbdy);
    // return tbl.innerHTML;
    // console.log(`Worker generated this HTML:\n${html}`);
    return html;
}