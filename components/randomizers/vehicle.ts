import {
  ActiveVehicle,
  calculateTotalCost,
  calculateBuildSlotsInUse,
  VehicleType,
} from "../rules/vehicles";
import { vehicleTypes } from "../rules/vehicles";

import { getRandomThatFitsRequirements, randomFromArray } from "./utils";
import { generateCarName } from "./names";
import addRandomUpgradeFittingRequirements from "./upgrade";
import addRandomWeaponFittingRequirements from "./weapon";
import { getDefaultWeaponTypes } from "../rules/weapons";
import {
  getDefaultUpgrades,
  getEmptyDirections,
  getPossibleDirections,
} from "../rules/vehicleUpgrades";
import { WeaponFacingDirection } from "../rules/facing";

enum FeatureToAdd {
  Weapon = "weapon",
  Upgrade = "upgrade",
}

interface VehicleRequirements {
  maxCost: number;
}

const checkRequirements = (vehicle: VehicleType, requirements: VehicleRequirements) => vehicle.cost <= requirements.maxCost;
const getRandomVehicleInRequirements = (requirements: VehicleRequirements) => getRandomThatFitsRequirements(vehicleTypes, requirements, checkRequirements)

const getRandomFeatureTypeToAdd = () =>
  randomFromArray(Object.values(FeatureToAdd));

export default function createRandomCar(value: number = 30): ActiveVehicle {
  const vehicleRequirements: VehicleRequirements = {
    maxCost: value
  }

  const vehicleType = getRandomVehicleInRequirements(vehicleRequirements);

  if (!vehicleType) {
    throw new Error("No vehicle found");
  }

  let requirements = {
    maxCost: value,
    maxSlots: vehicleType.buildSlots,
    emptyDirections: [] as Array<WeaponFacingDirection>,
  };

  let vehicle: ActiveVehicle = {
    type: vehicleType,
    weapons: getDefaultWeaponTypes(),
    upgrades: getDefaultUpgrades(vehicleType.includedUpgrades),
    name: generateCarName(),
  };

  while (calculateTotalCost(vehicle) < value) {
    let featureToAdd = getRandomFeatureTypeToAdd();
    requirements = {
      maxCost: value - calculateTotalCost(vehicle),
      maxSlots: vehicleType.buildSlots - calculateBuildSlotsInUse(vehicle),
      emptyDirections: getEmptyDirections(vehicle.upgrades),
    };

    if (featureToAdd === FeatureToAdd.Weapon) {
      vehicle = {
        ...vehicle,
        weapons: addRandomWeaponFittingRequirements(
          requirements,
          vehicle.weapons
        ),
      };
    }

    if (featureToAdd === FeatureToAdd.Upgrade) {
      vehicle = {
        ...vehicle,
        upgrades: addRandomUpgradeFittingRequirements(
          requirements,
          vehicle.upgrades
        ),
      };
    }
  }

  return vehicle;
}
