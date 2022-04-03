import { WeaponFacing, WeaponFacingDirection } from "../rules/facing";
import {
  weaponTypes,
  ActiveWeapon,
  getInitialFacing,
  WeaponType,
} from "../rules/weapons";
import {
  getRandomThatFitsRequirements as getRandomItemFittingRequirements,
  randomFromArray,
} from "./utils";

interface WeaponFitRequirements {
  maxCost: number;
  maxSlots: number;
  emptyDirections: WeaponFacingDirection[];
}

const checkUpgradeRequirements = (
  weapon: WeaponType,
  context: WeaponFitRequirements
) => weapon.cost <= context.maxCost && weapon.buildSlots <= context.maxSlots && weapon.isDefault !== true;
const getRandomWeaponFittingRequirements = (
  requirements: WeaponFitRequirements
) =>
  getRandomItemFittingRequirements(
    weaponTypes,
    requirements,
    checkUpgradeRequirements
  );

const directions: Array<WeaponFacingDirection> = ["front", "rear", "side"];

const getRandomFacing = (weapon: WeaponType): WeaponFacing => {
  const initialFacing = getInitialFacing(weapon);

  if (initialFacing.type === "WeaponFacingUserSelected") {
    return {
      ...initialFacing,
      direction: randomFromArray(directions),
    };
  }

  return initialFacing;
};

export default function addRandomWeaponFittingRequirements(
  requirements: WeaponFitRequirements = {
    maxCost: 5,
    maxSlots: 1,
    emptyDirections: [],
  },
  currentWeapons: Array<ActiveWeapon> = []
): Array<ActiveWeapon> {
  let weapon = getRandomWeaponFittingRequirements(requirements);

  if (weapon) {
    return [
      ...currentWeapons,
      {
        type: weapon,
        facing: getRandomFacing(weapon),
      },
    ];
  }

  return currentWeapons;
}
