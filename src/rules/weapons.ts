import { WeaponFacing } from "./facing";

export type WeaponRange = "Short" | "Medium" | "Double";
export type WeaponSpecialRules = "Crew fired";

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
