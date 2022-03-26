import { ActiveWeapon, calculateActiveWeaponCost } from "./weapons";
import { ActiveVehicleUpgrade, VehicleUpgrade } from "./vehicleUpgrades";

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
  includedUpgrades?: string[];
  specialRule?: string;
  forbiddenUpgrades?: string[];
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
    includedUpgrades: ["Roll Cage"],
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
  },
  {
    name: "Drag Racer",
    abbreviation: "dr",
    weight: "Lightweight",
    hull: 4,
    handling: 4,
    maxGear: 6,
    crew: 1,
    buildSlots: 2,
    cost: 5,
    specialRule: "Jet Engine."
  },
  {
    name: "Bike",
    abbreviation: "bk",
    weight: "Lightweight",
    hull: 4,
    handling: 5,
    maxGear: 6,
    crew: 1,
    buildSlots: 1,
    cost: 5,
    specialRule: "Full Throttle. Pivot."
  },
  {
    name: "Bike with Sidecar",
    abbreviation: "bks",
    weight: "Lightweight",
    hull: 4,
    handling: 5,
    maxGear: 6,
    crew: 2,
    buildSlots: 2,
    cost: 8,
    specialRule: "Full Throttle. Pivot."
  },
  {
    name: "Ice-cream Truck",
    abbreviation: "it",
    weight: "Middleweight",
    hull: 10,
    handling: 2,
    maxGear: 4,
    crew: 2,
    buildSlots: 2,
    cost: 8,
    specialRule: "Infuriating Jingle."
  },
  {
    name: "Gyrocopter",
    abbreviation: "gc",
    weight: "Middleweight",
    hull: 4,
    handling: 4,
    maxGear: 6,
    crew: 1,
    buildSlots: 0,
    cost: 10,
    specialRule: "Airwolf. Airborne.",
    forbiddenUpgrades: ["Tank Tracks"]
  },
  {
    name: "Ambulance",
    abbreviation: "a",
    weight: "Middleweight",
    hull: 12,
    handling: 2,
    maxGear: 5,
    crew: 3,
    buildSlots: 3,
    cost: 20,
    specialRule: "Uppers. Downers."
  },
  {
    name: "Monster Truck",
    abbreviation: "mt",
    weight: "Heavyweight",
    hull: 10,
    handling: 3,
    maxGear: 4,
    crew: 2,
    buildSlots: 2,
    cost: 25,
    specialRule: "All Terrain. Up and Over."
  },
  // TODO: Helicopter (Rutherford only), forbiddenUpgrades: ["Tank Tracks"]
  {
    name: "War Rig",
    abbreviation: "wr",
    weight: "Heavyweight",
    hull: 26,
    handling: 2,
    maxGear: 4,
    crew: 5,
    buildSlots: 5,
    cost: 40,
    specialRule: "See War Rig rules."
  }
  // TODO: Tank (Rutherford only), forbiddenUpgrades: ["Tank Tracks"]
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
    weapons.reduce(
      (acc, weapon) => acc + calculateActiveWeaponCost(weapon),
      0
    ) +
    upgrades
      .filter(({ type: { name } }) => {
        return !(type.includedUpgrades || []).includes(name);
      })
      .reduce((acc, { type: { cost }, amount }) => acc + amount * cost, 0)
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

  return vehicle.type.hull + upgradeHullPoints;
}

export function calculateBuildSlotsInUse(vehicle: ActiveVehicle): number {
  const weaponSlots = vehicle.weapons.reduce(
    (acc: number, w: ActiveWeapon) => acc + w.type.buildSlots,
    0
  );
  const upgradeSlots = vehicle.upgrades.reduce(
    (acc: number, { type, amount }) => acc + amount * type.buildSlots,
    0
  );

  return weaponSlots + upgradeSlots;
}

export function calculateTotalCrew(vehicle: ActiveVehicle): number {
  const upgradeCrew = vehicle.upgrades
    .map(({ type, amount }: ActiveVehicleUpgrade): number => {
      const crewOfAllEffects = type.effects
        .map(effect => (effect.type === "CrewUpgradeEffect" ? effect.crew : 0))
        .reduce(
          (acc: number, currentEffectCrew: number): number =>
            acc + currentEffectCrew,
          0
        );
      return amount * crewOfAllEffects;
    })
    .reduce((acc: number, currentUpgradeCrew) => acc + currentUpgradeCrew, 0);

  return vehicle.type.crew + upgradeCrew;
}

export function calculateMaxGear(vehicle: ActiveVehicle): number {
  const upgradeMaxGear = vehicle.upgrades
    .map(({ type, amount }: ActiveVehicleUpgrade): number => {
      const gearOfAllEffects = type.effects
        .map(effect =>
          effect.type === "MaxGearUpgradeEffect" ? effect.gear : 0
        )
        .reduce(
          (acc: number, currentEffectGear: number): number =>
            acc + currentEffectGear,
          0
        );
      return amount * gearOfAllEffects;
    })
    .reduce((acc: number, currentUpgradeGear) => acc + currentUpgradeGear, 0);

  return Math.min(6, Math.max(1, vehicle.type.maxGear + upgradeMaxGear));
}

export function calculateHandling(vehicle: ActiveVehicle): number {
  const upgradeHandling = vehicle.upgrades
    .map(({ type, amount }: ActiveVehicleUpgrade): number => {
      const handlingOfAllEffects = type.effects
        .map(effect =>
          effect.type === "HandlingUpgradeEffect" ? effect.handling : 0
        )
        .reduce(
          (acc: number, currentEffectHandling: number): number =>
            acc + currentEffectHandling,
          0
        );
      return amount * handlingOfAllEffects;
    })
    .reduce(
      (acc: number, currentUpgradeHandling) => acc + currentUpgradeHandling,
      0
    );

  return vehicle.type.handling + upgradeHandling;
}
