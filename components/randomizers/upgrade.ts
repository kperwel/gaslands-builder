import { WeaponFacingDirection } from "../rules/facing";
import {
  ActiveVehicleUpgrade,
  addUpgradeToVehicleUpgrades,
  getPossibleDirections,
  isActiveVehicleUpgradeWithFacing,
  isVehicleUpgradeWithFacing,
  VehicleUpgrade,
  vehicleUpgrades,
} from "../rules/vehicleUpgrades";
import {
  getRandomThatFitsRequirements as getRandomItemFittingRequirements,
  getShuffled,
  randomFromArray,
} from "./utils";

const getRandomPossibleFacing = (
  upgrade: VehicleUpgrade,
  vehicleUpgrades: ActiveVehicleUpgrade[]
) => {
  if (getPossibleDirections(upgrade, vehicleUpgrades).length === 0) {
    throw Error("No possible directions for this upgrade");
  }
    return randomFromArray(getPossibleDirections(upgrade, vehicleUpgrades));
  };

interface UpgradeFitRequirements {
  maxCost: number;
  maxSlots: number;
  emptyDirections: WeaponFacingDirection[];
}

const checkUpgradeRequirements = (
  upgrade: VehicleUpgrade,
  context: UpgradeFitRequirements
) => upgrade.cost <= context.maxCost && upgrade.buildSlots <= context.maxSlots && (context.emptyDirections.length > 0 || !isVehicleUpgradeWithFacing(upgrade));

const getRandomUpgradeFittingRequirements = (
  requirements: UpgradeFitRequirements
) =>
  getRandomItemFittingRequirements(
    vehicleUpgrades,
    requirements,
    checkUpgradeRequirements
  );

export default function addRandomUpgradeFittingRequirements(
  requirements: UpgradeFitRequirements = { maxCost: 5, maxSlots: 1, emptyDirections: [] },
  currentUpgrades: Array<ActiveVehicleUpgrade> = []
): Array<ActiveVehicleUpgrade> {
  let upgrade = getRandomUpgradeFittingRequirements(requirements);

  if (upgrade) {
    return addUpgradeToVehicleUpgrades(
      currentUpgrades,
      upgrade,
      getRandomPossibleFacing
    );
  }

  return currentUpgrades;
}
