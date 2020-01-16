import { WeaponFacing } from "./facing";

export type WeaponRange =
  | "Short"
  | "Medium"
  | "Double"
  | "Small Burst"
  | "Large Burst"
  | "Dropped";

// TODO: add special rule explanations
export type WeaponSpecialRules =
  | "Crew fired"
  | "Blast"
  | "Splash"
  | "Fire"
  | "Indirect"
  | "Blitz";

export interface WeaponType {
  name: string;
  abbreviation: string;
  range: WeaponRange;
  attackDice: number;
  specialRules: WeaponSpecialRules[];
  buildSlots: number;
  cost: number;
  isDefault?: boolean;
  isCrewFired?: boolean;
  description?: string;
  ammo?: number;
}

export const weaponTypes: WeaponType[] = [
  {
    name: "Handgun",
    abbreviation: "hg",
    range: "Medium",
    attackDice: 1,
    specialRules: ["Crew fired"],
    buildSlots: 0,
    cost: 0,
    isDefault: true,
    isCrewFired: true
  },
  {
    name: "Machine Gun",
    abbreviation: "mg",
    range: "Double",
    attackDice: 2,
    specialRules: [],
    buildSlots: 1,
    cost: 2
  },
  {
    name: "Heavy Machine Gun",
    abbreviation: "hmg",
    range: "Double",
    attackDice: 3,
    specialRules: [],
    buildSlots: 1,
    cost: 3
  },
  {
    name: "Minigun",
    abbreviation: "mng",
    range: "Double",
    attackDice: 4,
    specialRules: [],
    buildSlots: 1,
    cost: 5
  },
  {
    name: "125mm Cannon",
    abbreviation: "c",
    range: "Double",
    attackDice: 8,
    specialRules: [],
    buildSlots: 3,
    cost: 6,
    description: "When fired gain 2 hazard tokens (if not a tank)"
  },
  // TODO: Arc Lightning Projector (Mishkin only)
  {
    name: "Bazooka",
    abbreviation: "b",
    range: "Double",
    attackDice: 3,
    specialRules: ["Blast"],
    buildSlots: 2,
    cost: 4,
    ammo: 3
  },
  {
    name: "BFG",
    abbreviation: "bfg",
    range: "Double",
    attackDice: 10,
    specialRules: ["Blast"],
    buildSlots: 3,
    cost: 1,
    ammo: 1,
    description:
      "When fired make immediate forced move medium straight backwards, switch to Gear 1, gain 3 Hazard tokens. Front mounted only."
    // TODO: force front mounted only
  },
  {
    name: "Blunderbuss",
    abbreviation: "bb",
    range: "Small Burst",
    attackDice: 2,
    specialRules: ["Crew fired"],
    buildSlots: 0,
    cost: 2
  },
  {
    name: "Caltrop Dropper",
    abbreviation: "cd",
    range: "Dropped",
    attackDice: 2,
    specialRules: ["Crew fired"],
    buildSlots: 1,
    cost: 1,
    ammo: 3,
    description:
      "Small burst, template is treacherous surface, first vehicle is attacked with 2D6, then remove."
  },
  {
    name: "Combat Laser",
    abbreviation: "cl",
    range: "Double",
    attackDice: 3,
    specialRules: ["Splash"],
    buildSlots: 1,
    cost: 5
  },
  // TODO: Death Ray (Mishkin only)
  {
    name: "Flamethrower",
    abbreviation: "ft",
    range: "Large Burst",
    attackDice: 6,
    specialRules: ["Splash", "Fire", "Indirect"],
    buildSlots: 2,
    cost: 4,
    ammo: 3
  },
  {
    name: "Gas Grenades",
    abbreviation: "gg",
    range: "Medium",
    attackDice: 1,
    specialRules: ["Crew fired", "Indirect", "Blitz"],
    buildSlots: 0,
    cost: 1,
    ammo: 5,
    description:
      "For each hit, reduce targets crew value by one instead of causing damage."
  },
  {
    name: "Glue Dropper",
    abbreviation: "gd",
    range: "Dropped",
    attackDice: 0,
    specialRules: [],
    buildSlots: 1,
    cost: 1,
    ammo: 1,
    description:
      "Large Burst, template is treacherous surface, affected vehicle must reduce gear by 2 at end of movement step."
  },
  {
    name: "Grabber Arm",
    abbreviation: "ga",
    range: "Short",
    attackDice: 3,
    specialRules: [],
    buildSlots: 1,
    cost: 6,
    description: "See special rules."
  },
  // TODO: Grav Gun (Mishkin only)
  {
    name: "Grenades",
    abbreviation: "g",
    range: "Medium",
    attackDice: 1,
    specialRules: ["Crew fired", "Blast", "Indirect", "Blitz"],
    buildSlots: 0,
    cost: 1,
    ammo: 5,
    description: "See special rules."
  },
  {
    name: "Harpoon",
    abbreviation: "h",
    range: "Double",
    attackDice: 5,
    specialRules: [],
    buildSlots: 1,
    cost: 2,
    description: "See special rules."
  },
  // TODO: Kinetic Super Booster (Mishkin only)
  // TODO: Magnetic Jammer (Mishkin only)
  {
    name: "Magnum",
    abbreviation: "m",
    range: "Double",
    attackDice: 1,
    specialRules: ["Crew fired", "Blast"],
    buildSlots: 0,
    cost: 3,
    description: "See special rules."
  },
  {
    name: "Mine Dropper",
    abbreviation: "md",
    range: "Dropped",
    attackDice: 4,
    specialRules: ["Blast"],
    buildSlots: 1,
    cost: 1,
    ammo: 3,
    description: "Small burst, first vehicle is attacked with 4D6, then remove."
  },
  {
    name: "Molotov Cocktails",
    abbreviation: "mc",
    range: "Medium",
    attackDice: 1,
    specialRules: ["Crew fired", "Fire", "Indirect", "Blitz"],
    buildSlots: 0,
    cost: 1,
    ammo: 5,
    description: "Small burst, first vehicle is attacked with 4D6, then remove."
  },
  {
    name: "Mortar",
    abbreviation: "mr",
    range: "Double",
    attackDice: 4,
    specialRules: ["Indirect"],
    buildSlots: 1,
    cost: 4,
    ammo: 3
  },
  {
    name: "Napalm Dropper",
    abbreviation: "nd",
    range: "Dropped",
    attackDice: 4,
    specialRules: ["Fire"],
    buildSlots: 1,
    cost: 1,
    ammo: 3,
    description: "Small burst, first vehicle is attacked with 4D6, then remove."
  },
  {
    name: "Oil Slick Dropper",
    abbreviation: "osd",
    range: "Dropped",
    attackDice: 0,
    specialRules: [],
    buildSlots: 0,
    cost: 2,
    ammo: 3,
    description: "Large burst, counts as treacherous surface."
  },
  {
    name: "RC Car Bombs",
    abbreviation: "rc",
    range: "Dropped",
    attackDice: 4,
    specialRules: [],
    buildSlots: 0,
    cost: 3,
    ammo: 3,
    description: "See special rules."
  },
  {
    name: "Rockets",
    abbreviation: "r",
    range: "Double",
    attackDice: 6,
    specialRules: [],
    buildSlots: 2,
    cost: 5,
    ammo: 3
  },
  {
    name: "Sentry Gun",
    abbreviation: "sg",
    range: "Dropped",
    attackDice: 2,
    specialRules: [],
    buildSlots: 0,
    cost: 3,
    ammo: 3,
    description: "See special rules."
  },
  {
    name: "Smoke Dropper",
    abbreviation: "sd",
    range: "Dropped",
    attackDice: 0,
    specialRules: [],
    buildSlots: 0,
    cost: 1,
    ammo: 3,
    description:
      "Large burst, gain 1 Hazard Token when touched, distrated while in contact."
  },
  {
    name: "Steel Nets",
    abbreviation: "sn",
    range: "Short",
    attackDice: 3,
    specialRules: ["Crew fired", "Blast"],
    buildSlots: 0,
    cost: 2,
    description: "No damage, only Hazard Tokens on Blast."
  },
  {
    name: "Submachine Gun",
    abbreviation: "sg",
    range: "Medium",
    attackDice: 3,
    specialRules: ["Crew fired"],
    buildSlots: 0,
    cost: 5
  },
  // TODO: Thumper (Mishkin only)
  {
    name: "Wall Of Amplifiers",
    abbreviation: "wa",
    range: "Medium",
    attackDice: 0,
    specialRules: [],
    buildSlots: 3,
    cost: 4,
    description: "360° arc of fire. See special rules."
    // TODO: force 360° arc of fire
  },
  {
    name: "Wreck Lobber",
    abbreviation: "wl",
    range: "Dropped",
    attackDice: 4,
    specialRules: [],
    buildSlots: 4,
    cost: 3,
    ammo: 3,
    description: "See special rules."
  },
  {
    name: "Wrecking Ball",
    abbreviation: "wb",
    range: "Short",
    attackDice: 0,
    specialRules: [],
    buildSlots: 3,
    cost: 2,
    description: "See special rules."
  }
];

export const defaultWeaponTypes: WeaponType[] = weaponTypes.filter(
  ({ isDefault }) => isDefault
);

export interface ActiveWeapon {
  type: WeaponType;
  facing: WeaponFacing;
}

export function isTurretMountedWeapon({ type, facing }: ActiveWeapon): boolean {
  return (
    facing.type === "WeaponFacingUserSelected" && facing.direction === "360°"
  );
}

export function calculateActiveWeaponCost(weapon: ActiveWeapon): number {
  const mountFactor = isTurretMountedWeapon(weapon) ? 3 : 1;
  return mountFactor * weapon.type.cost;
}
