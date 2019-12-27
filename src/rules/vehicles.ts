import { ActiveWeapon } from "./weapons";
import {
  ActiveVehicleUpgrade,
  VehicleUpgrade,
  VehicleUpgradeEffect
} from "./vehicleUpgrades";

export type VehicleWeight = "Lightweight" | "Middleweight" | "Heavyweight";

export interface VehicleType {
  name: string;
  abbreviation: string;
  weight: VehicleWeight;
  hull: number;
  handling: number;
  maxGear: number;
  crew: number;
  buildSlots: number;
  cost: number;
  specialRule?: string;
}

export const vehicleTypes: VehicleType[] = [
  {
    name: "Buggy",
    abbreviation: "bg",
    weight: "Lightweight",
    hull: 6,
    handling: 4,
    maxGear: 6,
    crew: 2,
    buildSlots: 2,
    cost: 6,
    specialRule: "Roll Cage"
  },
  {
    name: "Car",
    abbreviation: "c",
    weight: "Middleweight",
    hull: 10,
    handling: 3,
    maxGear: 5,
    crew: 2,
    buildSlots: 2,
    cost: 12
  },
  {
    name: "Performance Car",
    abbreviation: "pc",
    weight: "Middleweight",
    hull: 8,
    handling: 4,
    maxGear: 6,
    crew: 1,
    buildSlots: 2,
    cost: 15,
    specialRule: "Slip Away"
  },
  {
    name: "Truck",
    abbreviation: "t",
    weight: "Middleweight",
    hull: 12,
    handling: 2,
    maxGear: 4,
    crew: 3,
    buildSlots: 3,
    cost: 15
  },
  {
    name: "Heavy Truck",
    abbreviation: "ht",
    weight: "Heavyweight",
    hull: 14,
    handling: 2,
    maxGear: 3,
    crew: 4,
    buildSlots: 5,
    cost: 25
  },
  {
    name: "Bus",
    abbreviation: "bs",
    weight: "Heavyweight",
    hull: 16,
    handling: 2,
    maxGear: 3,
    crew: 8,
    buildSlots: 3,
    cost: 30
  }
];

export interface ActiveVehicle {
  type: VehicleType;
  weapons: ActiveWeapon[];
  upgrades: ActiveVehicleUpgrade[];
}

export function calculateTotalCost({
  type,
  weapons,
  upgrades
}: ActiveVehicle): number {
  return (
    type.cost +
    weapons.reduce((acc, { type: { cost } }) => acc + cost, 0) +
    upgrades.reduce((acc, { type: { cost }, amount }) => acc + amount * cost, 0)
  );
}

export function calculateTotalHull(vehicle: ActiveVehicle): number {
  const upgradeHullPoints = vehicle.upgrades
    .flatMap(
      activeUpgrade =>
        Array.from({ length: activeUpgrade.amount }).fill(
          activeUpgrade.type
        ) as VehicleUpgrade[]
    )
    .flatMap(upgradeType => upgradeType.effects)
    .reduce(
      (acc, effect) =>
        acc + (effect.type === "ArmourUpgradeEffect" ? effect.hull : 0),
      0
    );

  console.log({
    upgrades: vehicle.upgrades,
    upgradeHullPoints
  });

  return vehicle.type.hull + upgradeHullPoints;
}
