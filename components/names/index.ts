import adjectiveDb from "./words/adjective.json";
import nounDb from "./words/noun.json";
import prepositionDb from "./words/preposition.json";

const makePlural = (word: string) => `${word}${word.endsWith("s") ? "" : "s"}`;
const adjective = () => randomFromArray(adjectiveDb);
const noun = () => randomFromArray(nounDb);
const preposition = () => randomFromArray(prepositionDb);

const randomFromArray = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

interface NameGenerator {
  (): string;
}

const singularGenerators: Array<NameGenerator> = [
  () =>
    `${makeFirstLetterUpperCase(adjective())} ${makeFirstLetterUpperCase(
      noun()
    )}`,
  () =>
    `${makeFirstLetterUpperCase(
      noun()
    )} ${preposition()} ${makeFirstLetterUpperCase(makePlural(noun()))}`,
];

const pluralGenerators: Array<NameGenerator> = [
  () =>
    `${makeFirstLetterUpperCase(adjective())} ${makeFirstLetterUpperCase(
      makePlural(noun())
    )}`,
  () =>
    `${makeFirstLetterUpperCase(
      makePlural(noun())
    )} ${preposition()} ${makeFirstLetterUpperCase(makePlural(noun()))}`,
];

export function generateCarName() {
  return randomFromArray(singularGenerators)();
}

export function generateTeamName() {
  return randomFromArray(pluralGenerators)();
}

const makeFirstLetterUpperCase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
