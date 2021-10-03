import { Game } from "../melee/game";
import { Hero } from "../melee/hero";
import { log, setMute } from "../logger";
import { HeroesSingleton } from "../melee/heroesSingleton";

const ctx: Worker = self as any;

let poleWeaponsChargeFirstRound = false;
let defendVsPoleCharge = false;

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
            data.selectedHeroes.forEach(function (heroID: string) {
                let hero = completeHeroMap.get(HeroesSingleton.getNameFromID(heroID));
                if (hero) heroSet.push(hero); else console.log(`  !!! Didn't find ${HeroesSingleton.getNameFromID(heroID)} (${heroID}) in map !!!`);
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
    console.log(` in worker...`);
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
    let html = `<caption>${caption}</caption><thead>`;
    if (isVersus) {
        html += `<tr><th>Hero 1</th><th>vs Hero 2</th>`
    } else {
        html += `<tr><th>Hero</th>`
    }
    html += `<th id="${isVersus ? 'match' : ''}wins" style="text-align: right;">Wins</th><th class="" style="text-align: right;">% total</th></tr></thead>`;
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
            tbody += `<td style="text-align: right;">${heroWins[property]}</td>`
            tbody += `<td style="text-align: right;">${percentageWin}</td></tr>`
        }
    }
    html += `<tbody>${tbody}</tbody>`;
    return html;
}