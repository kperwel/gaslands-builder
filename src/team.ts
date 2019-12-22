import {
  ActiveVehicle,
  calculateTotalCost,
  vehicleTypes
} from "./rules/vehicles";
import { weaponFacingStringIsomorphism, weaponTypes } from "./rules/weapons";

export interface Team {
  name: string;
  vehicles: ActiveVehicle[];
}

type VehicleTypeAbbreviation = string;
type WeaponTypeAbbreviation = string;
type WeaponFacingAbbreviation = string;
type CondensedActiveWeapon = [WeaponTypeAbbreviation, WeaponFacingAbbreviation];

type CondensedActiveVehicle = [
  VehicleTypeAbbreviation,
  CondensedActiveWeapon[]
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

export const teamCondensationIsomorphism = {
  from: (queryString: string): Team => {
    try {
      const { name, vehicles }: CondensedTeam = JSON.parse(
        decodeURIComponent(queryString)
      );
      return {
        name,
        vehicles: vehicles.flatMap(
          (condensed: CondensedActiveVehicle): ActiveVehicle[] => {
            const [vehicleTypeAbbreviation, condensedActiveWeapons] = condensed;
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

            return [
              {
                type,
                weapons
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
          )
        ]
      )
    };
    return JSON.stringify(condensedTeam);
  }
};
