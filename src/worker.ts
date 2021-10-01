import { Game } from "./game";
import { Hero } from "./hero";
import { log, setMute } from "./logger";

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
    ctx.postMessage({ "cmd": "finished", "heroWins": heroWins, "matchupWins": matchupWins });
}
