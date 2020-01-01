import { assertNever } from "assert-never";

type WeaponFacingType =
  | "WeaponFacingUserSelected"
  | "WeaponFacingTurretMounted"
  | "WeaponFacingCrewFired";
export type WeaponFacingDirection = "front" | "rear" | "side" | "360°";

interface WeaponFacingBase<
  T extends WeaponFacingType,
  D extends WeaponFacingDirection = WeaponFacingDirection
> {
  type: T;
  direction: D;
}

interface WeaponFacingUserSelected
  extends WeaponFacingBase<"WeaponFacingUserSelected"> {}

interface WeaponFacingTurretMounted
  extends WeaponFacingBase<"WeaponFacingTurretMounted", "360°"> {}

interface WeaponFacingCrewFired
  extends WeaponFacingBase<"WeaponFacingCrewFired", "360°"> {}

export type WeaponFacing =
  | WeaponFacingUserSelected
  | WeaponFacingTurretMounted
  | WeaponFacingCrewFired;

const weaponFacingTypeAbbreviations: { [key: string]: WeaponFacingType } = {
  u: "WeaponFacingUserSelected",
  t: "WeaponFacingTurretMounted",
  c: "WeaponFacingCrewFired"
};

const weaponFacingDirectionAbbreviations: {
  [key: string]: WeaponFacingDirection;
} = {
  f: "front",
  r: "rear",
  s: "side",
  t: "360°"
};
const directions: WeaponFacingDirection[] = Object.values(
  weaponFacingDirectionAbbreviations
);

export const weaponFacingStringIsomorphism = {
  to: (facing: WeaponFacing): string => {
    const typeAbbreviation: string = (Object.entries(
      weaponFacingTypeAbbreviations
    ).find(([k, v]) => v === facing.type) ||
      Object.keys(weaponFacingTypeAbbreviations))[0];

    const { type } = facing;

    switch (type) {
      case "WeaponFacingUserSelected":
        const directionAbbreviation: string = (Object.entries(
          weaponFacingDirectionAbbreviations
        ).find(([k, v]) => v === facing.direction) ||
          Object.keys(weaponFacingDirectionAbbreviations))[0];
        return typeAbbreviation + ":" + directionAbbreviation;
      case "WeaponFacingTurretMounted":
      case "WeaponFacingCrewFired":
        return typeAbbreviation;
      default:
        assertNever(type);
    }
  },
  from: (abbreviation: string): WeaponFacing => {
    const type: WeaponFacingType =
      weaponFacingTypeAbbreviations[abbreviation.substr(0, 1)] ||
      "WeaponFacingUserSelected";
    switch (type) {
      case "WeaponFacingUserSelected":
        const direction: WeaponFacingDirection =
          weaponFacingDirectionAbbreviations[abbreviation.substr(2, 1)] ||
          "front";
        return {
          type: "WeaponFacingUserSelected",
          direction
        };
      case "WeaponFacingTurretMounted":
      case "WeaponFacingCrewFired":
        return {
          type,
          direction: "360°"
        };
      default:
        assertNever(type);
    }
  }
};

export function getNextFacing({ type, direction }: WeaponFacing): WeaponFacing {
  switch (type) {
    case "WeaponFacingUserSelected":
      const currentIndex = directions.indexOf(direction);
      const nextIndex = (currentIndex + 1) % 4;
      return {
        type,
        direction: directions[nextIndex]
      };
    case "WeaponFacingTurretMounted":
    case "WeaponFacingCrewFired":
      return { type, direction: "360°" };
    default:
      assertNever(type);
  }
}
