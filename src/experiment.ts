import { HeroesSingleton } from "./melee/heroesSingleton";

HeroesSingleton.getHeroesListJSON().forEach((hero, index) => {
    // const derivedName = `${(1+index).toString().padStart(3, "0")}:ST${hero.st};DX${hero.dx};${hero.weapon.name};${hero.armor.name};${hero.shield.name}`.toUpperCase().replace(/[ -]/g, '_');
    // if (HeroesSingleton.getNameFromID(hero.id) !== derivedName)
    //    console.log(`Hero: '${hero.id}', '${derivedName}'`);
    console.log(`'${hero.id}', ${hero.st}, ${hero.dx}, ${toTypeScriptCode(hero.weapon.name)}, ${toTypeScriptCode(hero.armor.name)}, ${toTypeScriptCode(hero.armor.name)}`)
})

function toTypeScriptCode(s: string) {
    return s.toUpperCase().replace(/[ -]/g, '_');
}