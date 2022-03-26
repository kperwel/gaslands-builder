import { ActiveVehicle } from "./vehicles";
import { WeaponFacing, WeaponFacingDirection } from "./facing";

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

export type UpgradeQuantity =
  | "single"
  | "limited"
  | "unlimited"
  | "singleEachFacing";

interface VehicleUpgradeWithoutFacing {
  name: string;
  abbreviation: string;
  description: string;
  effects: VehicleUpgradeEffect[];
  buildSlots: number;
  cost: number;
  quantity: UpgradeQuantity;
}

interface VehicleUpgradeWithFacing extends VehicleUpgradeWithoutFacing {
  configurableFacing: boolean;
}

export type VehicleUpgrade =
  | VehicleUpgradeWithoutFacing
  | VehicleUpgradeWithFacing;

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
    name: "Roll Cage",
    abbreviation: "rc",
    description: "Ignore 2 hits from flip",
    effects: [],
    buildSlots: 1,
    cost: 4,
    quantity: "single"
  },
  {
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
  },
  {
    name: "Ram",
    abbreviation: "r",
    description:
      "In a collision on declared face add 2 attack dice to smash attack and do not gain any hazard tokens",
    effects: [],
    buildSlots: 1,
    cost: 4,
    quantity: "singleEachFacing",
    configurableFacing: true
  },
  {
    name: "Exploding Ram",
    abbreviation: "er",
    description:
      "In first collision on declared face must declare smash attack with +6 W6, loose one hull point for every 1 or 2 rolled.",
    effects: [],
    buildSlots: 0,
    cost: 3,
    quantity: "singleEachFacing",
    configurableFacing: true
  }
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

interface ActiveVehicleUpgradeWithoutFacing {
  type: VehicleUpgradeWithoutFacing;
  amount: number;
}

interface ActiveVehicleUpgradeWithFacing {
  type: VehicleUpgradeWithFacing;
  amount: number;
  facing: WeaponFacing;
}

export type ActiveVehicleUpgrade =
  | ActiveVehicleUpgradeWithoutFacing
  | ActiveVehicleUpgradeWithFacing;

export function isActiveVehicleUpgradeWithFacing(
  upgrade: ActiveVehicleUpgrade
): upgrade is ActiveVehicleUpgradeWithFacing {
  return "facing" in upgrade && "configurableFacing" in upgrade.type;
}

export function getPossibleDirections(
  upgradeType: VehicleUpgrade,
  activeUpgrades: ActiveVehicleUpgrade[]
): WeaponFacingDirection[] {
  const activeFacings: WeaponFacingDirection[] = activeUpgrades.flatMap(u =>
    u.type === upgradeType && isActiveVehicleUpgradeWithFacing(u)
      ? [u.facing.direction]
      : []
  );

  const potentialDirections: WeaponFacingDirection[] = [
    "front",
    "rear",
    "side"
  ];
  return potentialDirections.filter(
    direction => !activeFacings.includes(direction)
  );
}

export function getNextExclusiveFacing(
  currentUpgrade: ActiveVehicleUpgradeWithFacing,
  activeUpgrades: ActiveVehicleUpgrade[]
): WeaponFacing {
  const possibleDirections = getPossibleDirections(
    currentUpgrade.type,
    activeUpgrades
  );
  const currentIndex = possibleDirections.indexOf(
    currentUpgrade.facing.direction
  );
  const direction =
    possibleDirections.length > 0
      ? possibleDirections[(currentIndex + 1) % possibleDirections.length]
      : currentUpgrade.facing.direction;

  return {
    type: "WeaponFacingUserSelected",
    direction
  };
}

export function addUpgradeToVehicleUpgrades(
  vehicleUpgrades: ActiveVehicleUpgrade[],
  upgrade: VehicleUpgrade
): ActiveVehicleUpgrade[] {
  const currentUpgrade = vehicleUpgrades.find(u => u.type === upgrade);

  const hasConfigurableFacing = "configurableFacing" in upgrade;

  return currentUpgrade && !hasConfigurableFacing
    ? vehicleUpgrades.map(u =>
        u.type === upgrade ? { ...u, amount: u.amount + 1 } : u
      )
    : [
        ...vehicleUpgrades,
        hasConfigurableFacing
          ? {
              type: upgrade,
              amount: 1,
              facing: {
                type: "WeaponFacingUserSelected",
                direction: getPossibleDirections(upgrade, vehicleUpgrades)[0]
              }
            }
          : { type: upgrade, amount: 1 }
      ];
}
