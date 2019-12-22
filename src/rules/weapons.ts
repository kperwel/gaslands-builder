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
  nonRemovable?: boolean;
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
    nonRemovable: true
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
  ({ nonRemovable }) => nonRemovable
);

// TODO: add 360° mounting
export type WeaponFacing = "front" | "rear" | "side";

const weaponFacingAbbreviations: { [key: string]: WeaponFacing } = {
  f: "front",
  r: "rear",
  s: "side"
};

export const weaponFacingStringIsomorphism = {
  to: (facing: WeaponFacing): string => {
    return (
      (Object.entries(weaponFacingAbbreviations).find(
        ([k, v]) => v === facing
      ) || [])[0] || "f"
    );
  },
  from: (abbreviation: string): WeaponFacing => {
    return weaponFacingAbbreviations[abbreviation] || "front";
  }
};

export interface ActiveWeapon {
  type: WeaponType;
  facing: WeaponFacing;
}
