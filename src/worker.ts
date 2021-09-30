import { Game } from "./game";
import { Hero } from "./hero";
import { log, setMute } from "./logger";

const ctx: Worker = self as any;
//const scope = (self as unknown) as Worker
// ctx.addEventListener('message', event => {
//   console.log(`Worker received: ${event.data}`)
//   ctx.postMessage('pong')
// })


////////////////


// This file must have worker types, but not DOM types.
// The global should be that of a dedicated worker.

// // This fixes `self`'s type.
// declare let self: DedicatedWorkerGlobalScope;
//  export {};

// const helloMessage = {
//   hello: 'world',
// };

// export type HelloMessage = typeof helloMessage;

// // Both of these should work.
// postMessage(helloMessage);
// self.postMessage(helloMessage);

let poleWeaponsChargeFirstRound = false;
let defendVsPoleCharge = false;

ctx.postMessage({ "cmd": "worker started" });

ctx.addEventListener('message', function(event: any) {
    /**
     * Only one type of message to start this thread
     */
    let data = event.data;
    let heroSet = new Array<Hero>();  // list of heroes to fight

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
});

function tryAllCombinations(heroSet: Array<Hero>, boutCount: number) {
    let matchupWins: {[index: string]: number} = {};  // map of hero and integer
    let heroWins: {[index: string]: number} = {};
    let game = null;
    let score = [2];
    let progress = 0;
    // how many bouts total is N * N-1 * boutCount
    let totalIterations = heroSet.length * (heroSet.length - 1) * boutCount / 2;
    let iterationCount = 0;
    // heroSet.forEach(function (hero1) {
    //     // heroWins.set(hero1.name, 0);
    //     // console.log(`Set heroWins to ${heroWins.get(hero1.name)} for ${hero1.name}`)
    //     heroSet.forEach( hero2 => {
    //         if (hero1 !== hero2) matchupWins.set(hero1.name + "/" + hero2.name, 0);
    //     });
    // });
    let lastUpdateTime = new Date(); // for throttling updates
    //console.log(heroWins);

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
                if (currentTime.getTime() - lastUpdateTime.getTime() > 200) {
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
                // console.log(fightingHero1);
                // console.log(fightingHero2);
                game = new Game(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
                let winningFighter = game.fightToTheDeath();

                if (winningFighter !== null) {
                    console.log(`Winning fighter is: ${winningFighter.name}`)
                    let losingFighter = (winningFighter === fightingHero1 ? fightingHero2 : fightingHero1);
                    console.log(` with score of ${score[(winningFighter === fightingHero1 ? 0 : 1)]++}`);
                    const key = winningFighter.name + "/" + losingFighter.name;
                    let currentWins = matchupWins[key];
                    if (currentWins) {
                        matchupWins.set(key, currentWins+1);
                        console.log(`Updating matchup wins for ${key} to ${currentWins + 1}`)
                    } else {
                        matchupWins.set(key, 1);
                        console.log(`Initializing matchup wins for ${key} to 1`)
                    }
                }
                sumRounds += game.round;
            }
            /**
             * Update the total stats for these heroes
             */
            let currScore = heroWins.get(hero1.name);
            if (currScore) {
                heroWins.set(hero1.name, currScore + score[0]);
                console.log(`Updating heroWins for hero: ${hero1.name}:${heroWins.get(hero1.name)}`);
            } else {
                heroWins.set(hero1.name, score[0]);
                console.log(`Initializing heroWins for hero: ${hero1.name}:${heroWins.get(hero1.name)}`);
            }
            currScore = heroWins.get(hero2.name);
            if (currScore) {
                heroWins.set(hero2.name, currScore + score[1]);
                console.log(`                       and: ${hero2.name}:${heroWins.get(hero2.name)}`);
            } else {
                heroWins.set(hero2.name, score[1]);
                console.log(`Initializing heroWins for hero: ${hero2.name}:${heroWins.get(hero2.name)}`);
            }
            // heroWins[hero1.name] += score[0];
            // heroWins[hero2.name] += score[1];
        }

    }
    /**
     * Put stats back on page
     */
    ctx.postMessage({ "cmd": "finished", "heroWins": heroWins, "matchupWins": matchupWins });
}
