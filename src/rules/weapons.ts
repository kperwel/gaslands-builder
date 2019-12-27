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

export type WeaponFacing = "front" | "rear" | "side" | "turret";

const weaponFacingAbbreviations: { [key: string]: WeaponFacing } = {
  f: "front",
  r: "rear",
  s: "side",
  t: "turret"
};

const facings: WeaponFacing[] = Object.values(weaponFacingAbbreviations);

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

export function getNextFacing(facing: WeaponFacing): WeaponFacing {
  if (facing === "turret") {
    return "turret";
  }

  const currentIndex = facings.indexOf(facing);
  const nextIndex = (currentIndex + 1) % 3;
  return facings[nextIndex];
}

export interface ActiveWeapon {
  type: WeaponType;
  facing: WeaponFacing;
}
