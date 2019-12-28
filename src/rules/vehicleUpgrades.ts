import { ActiveVehicle } from "./vehicles";

interface BaseUpgradeEffect<T extends string> {
  type: T;
}
interface ArmourUpgradeEffect extends BaseUpgradeEffect<"ArmourUpgradeEffect"> {
  hull: number;
}
export interface CrewUpgradeEffect
  extends BaseUpgradeEffect<"CrewUpgradeEffect"> {
  crew: number;
}
export interface MaxGearUpgradeEffect
  extends BaseUpgradeEffect<"MaxGearUpgradeEffect"> {
  gear: number;
}
export interface HandlingUpgradeEffect
  extends BaseUpgradeEffect<"HandlingUpgradeEffect"> {
  handling: number;
}

export type VehicleUpgradeEffect =
  | ArmourUpgradeEffect
  | CrewUpgradeEffect
  | MaxGearUpgradeEffect
  | HandlingUpgradeEffect;

export type UpgradeQuantity = "single" | "limited" | "unlimited";

export interface VehicleUpgrade {
  name: string;
  abbreviation: string;
  description: string;
  effects: VehicleUpgradeEffect[];
  buildSlots: number;
  cost: number;
  quantity: UpgradeQuantity;
}

export const vehicleUpgrades: VehicleUpgrade[] = [
  {
    name: "Armour Plating",
    abbreviation: "ap",
    description: "+2 Hull Points",
    effects: [
      {
        type: "ArmourUpgradeEffect",
        hull: 2
      }
    ],
    buildSlots: 1,
    cost: 4,
    quantity: "unlimited"
  },
  // TODO: Experimental Nuclear Engine (after Sponsors, Mishkin only)
  // TODO: Experimental Teleporter (after Sponsors, Mishkin only)
  {
    name: "Extra Crewmember",
    abbreviation: "c",
    description: "+1 Crew",
    effects: [
      {
        type: "CrewUpgradeEffect",
        crew: 1
      }
    ],
    buildSlots: 0,
    cost: 4,
    quantity: "limited"
  },
  {
    name: "Improvised Sludge Thrower",
    abbreviation: "st",
    description:
      "May place burst template for dropped weapons anywhere at least partially within medium range and 360° arc of fire",
    effects: [],
    buildSlots: 1,
    cost: 2,
    quantity: "single"
  },
  {
    name: "Nitro Booster",
    abbreviation: "nb",
    description:
      "Before normal movement step may make forced long straight move forward & gain hazards tokens until 5",
    effects: [],
    buildSlots: 0,
    cost: 6,
    quantity: "single"
  },
  {
    // TODO: automatically added for free for buggy
    name: "Roll Cage",
    abbreviation: "rc",
    description: "Ignore 2 hits from flip",
    effects: [],
    buildSlots: 1,
    cost: 4,
    quantity: "single"
  },
  {
    // TODO: not for tank, helicopter & gyrocopter
    name: "Tank Tracks",
    abbreviation: "tt",
    description: "-1 Max gear, +1 Handling",
    effects: [
      {
        type: "MaxGearUpgradeEffect",
        gear: -1
      },
      {
        type: "HandlingUpgradeEffect",
        handling: 1
      }
    ],
    buildSlots: 1,
    cost: 4,
    quantity: "single"
  }
  // TODO: Ram
  // TODO: Exploding Ram
];

export const vehicleUpgradeLimitCalculators: {
  [key: string]: (v: ActiveVehicle) => number;
} = {
  c: vehicle => vehicle.type.crew
};

export function calculateUpgradeQuantityLimit(
  upgrade: VehicleUpgrade,
  vehicle: ActiveVehicle
) {
  return (vehicleUpgradeLimitCalculators[upgrade.abbreviation] || (() => 0))(
    vehicle
  );
}

export interface ActiveVehicleUpgrade {
  type: VehicleUpgrade;
  amount: number;
}
