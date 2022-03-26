import {
  ActiveVehicle,
  calculateTotalCost,
  vehicleTypes
} from "./rules/vehicles";
import { weaponTypes } from "./rules/weapons";
import {
  ActiveVehicleUpgrade,
  isActiveVehicleUpgradeWithFacing,
  vehicleUpgrades
} from "./rules/vehicleUpgrades";
import {
  WeaponFacingDirection,
  weaponFacingStringIsomorphism
} from "./rules/facing";
import urlon from "urlon";

export interface Team {
  name: string;
  vehicles: ActiveVehicle[];
}

type VehicleTypeAbbreviation = string;
type WeaponTypeAbbreviation = string;
type WeaponFacingAbbreviation = string;
type CondensedActiveWeapon = [WeaponTypeAbbreviation, WeaponFacingAbbreviation];
type UpgradeTypeAbbreviaiton = string;
type UpgradeAmount = number;
type CondensedActiveUpgrade =
  | [UpgradeTypeAbbreviaiton]
  | [UpgradeTypeAbbreviaiton, UpgradeAmount]
  | [UpgradeTypeAbbreviaiton, UpgradeAmount, WeaponFacingDirection];

type CondensedActiveVehicle = [
  VehicleTypeAbbreviation,
  CondensedActiveWeapon[],
  CondensedActiveUpgrade[]
];

interface CondensedTeam {
  name: string;
  vehicles: CondensedActiveVehicle[];
}

export const INITIAL_TEAM: Team = { name: "New Team", vehicles: [] };

export function calculateTotalTeamCost(team: Team) {
  return team.vehicles.reduce(
    (acc, vehicle) => acc + calculateTotalCost(vehicle),
    0
  );
}

function parseQueryString(queryString: string) {
  try {
    return urlon.parse(decodeURIComponent(queryString));
  } catch (e) {
    console.warn("Unable to parse querystring as urlon");
  }
  try {
    return JSON.parse(decodeURIComponent(queryString));
  } catch (e) {
    console.warn("Unable to parse querystring as JSON");
  }
}

export const teamCondensationIsomorphism = {
  from: (queryString: string): Team => {
    try {
      const { name, vehicles }: CondensedTeam = parseQueryString(queryString);
      return {
        name,
        vehicles: vehicles.flatMap(
          (condensed: CondensedActiveVehicle): ActiveVehicle[] => {
            const [
              vehicleTypeAbbreviation,
              condensedActiveWeapons,
              condensedUpgrades
            ] = condensed;
            const type = vehicleTypes.find(
              v => v.abbreviation === vehicleTypeAbbreviation
            );

            if (!type) {
              return [];
            }

            const weapons = condensedActiveWeapons.flatMap(
              ([typeAbbreviation, facingAbbreviation]) => {
                const type = weaponTypes.find(
                  w => w.abbreviation === typeAbbreviation
                );
                return type
                  ? [
                      {
                        type,
                        facing: weaponFacingStringIsomorphism.from(
                          facingAbbreviation
                        )
                      }
                    ]
                  : [];
              }
            );

            const upgrades: ActiveVehicleUpgrade[] = condensedUpgrades.flatMap(
              ([typeAbbreviation, amount = 1, facingDirection]) => {
                const type = vehicleUpgrades.find(
                  u => u.abbreviation === typeAbbreviation
                );
                if (!type) {
                  return [];
                }

                return "configurableFacing" in type
                  ? [
                      {
                        type,
                        amount,
                        facing: {
                          type: "WeaponFacingUserSelected",
                          direction: facingDirection || "front"
                        }
                      }
                    ]
                  : [{ type, amount }];
              }
            );

            return [
              {
                type,
                weapons,
                upgrades
              }
            ];
          }
        )
      };
    } catch (e) {
      console.warn("Unable to parse query string", e);
      return INITIAL_TEAM;
    }
  },
  to: ({ name, vehicles }: Team): string => {
    const condensedTeam: CondensedTeam = {
      name,
      vehicles: vehicles.map(
        (v: ActiveVehicle): CondensedActiveVehicle => [
          v.type.abbreviation,
          v.weapons.map(
            ({ type, facing }): CondensedActiveWeapon => [
              type.abbreviation,
              weaponFacingStringIsomorphism.to(facing)
            ]
          ),
          v.upgrades.map(upgrade => {
            const {
              type: { abbreviation },
              amount
            } = upgrade;
            return isActiveVehicleUpgradeWithFacing(upgrade)
              ? [abbreviation, amount, upgrade.facing.direction]
              : [abbreviation, amount];
          })
        ]
      )
    };
    return urlon.stringify(condensedTeam);
  }
};
