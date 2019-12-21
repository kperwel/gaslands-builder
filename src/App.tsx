import React from "react";
import styles from "./App.module.css";
import {
  ActiveVehicle,
  calculateTotalCost,
  vehicleTypes
} from "./rules/vehicles";
import VehicleCard from "./VehicleCard";
import {
  Button,
  Menu,
  Navbar,
  Popover,
  Position,
  EditableText
} from "@blueprintjs/core";
import { useQueryStringReducer } from "./queryString";
import { defaultWeaponTypes, weaponTypes } from "./rules/weapons";
import { default as reducer, INITIAL_TEAM, Team } from "./teamReducer";

type VehicleTypeAbbreviation = string;
type WeaponTypeAbbreviation = string;
type CondensedActiveVehicle = [
  VehicleTypeAbbreviation,
  WeaponTypeAbbreviation[]
];
interface CondensedTeam {
  name: string;
  vehicles: CondensedActiveVehicle[];
}

function calculateTotalTeamCost(team: Team) {
  return team.vehicles.reduce(
    (acc, vehicle) => acc + calculateTotalCost(vehicle),
    0
  );
}

const App: React.FC = (): React.ReactElement => {
  const [team, dispatchTeamAction] = useQueryStringReducer(
    reducer,
    INITIAL_TEAM,
    {
      from: (queryString: string): Team => {
        try {
          const { name, vehicles }: CondensedTeam = JSON.parse(
            decodeURIComponent(queryString)
          );
          return {
            name,
            vehicles: vehicles.flatMap(
              (condensed: CondensedActiveVehicle): ActiveVehicle[] => {
                const [
                  vehicleTypeAbbreviation,
                  weaponTypeAbbreviations
                ] = condensed;
                const type = vehicleTypes.find(
                  v => v.abbreviation === vehicleTypeAbbreviation
                );

                if (!type) {
                  return [];
                }

                const weapons = weaponTypeAbbreviations.flatMap(abbr => {
                  const weapon = weaponTypes.find(w => w.abbreviation === abbr);
                  return weapon ? [weapon] : [];
                });

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
          vehicles: vehicles.map(v => [
            v.type.abbreviation,
            v.weapons.map(w => w.abbreviation)
          ])
        };
        return JSON.stringify(condensedTeam);
      }
    }
  );

  const { name, vehicles } = team;

  const addVehicle = (vehicle: ActiveVehicle): void => {
    dispatchTeamAction({ type: "addVehicle", vehicle });
  };

  const removeVehicle = (index: number): void => {
    dispatchTeamAction({ type: "removeVehicle", index });
  };

  const updateVehicle = (index: number, vehicle: ActiveVehicle): void => {
    dispatchTeamAction({ type: "updateVehicle", index, vehicle });
  };

  const updateTeamName = (name: string): void => {
    dispatchTeamAction({ type: "updateTeamName", name });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>Gaslands Builder</Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <main className={styles.main}>
        <div className={styles.controls}>
          <h1>
            <EditableText maxLength={80} value={name} onChange={updateTeamName}>
              New Team
            </EditableText>{" "}
            ({calculateTotalTeamCost(team)} cans)
          </h1>

          <Popover
            content={
              <Menu>
                {vehicleTypes.map(type => (
                  <Menu.Item
                    key={type.name}
                    text={type.name}
                    onClick={() =>
                      addVehicle({
                        type,
                        weapons: defaultWeaponTypes
                      })
                    }
                  ></Menu.Item>
                ))}
              </Menu>
            }
            position={Position.BOTTOM}
            minimal
          >
            <Button>Add vehicle</Button>
          </Popover>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map((vehicle, index) => (
            <div
              className={styles.vehiclesItem}
              key={`${vehicle.type}-${index}`}
            >
              <VehicleCard
                vehicle={vehicle}
                onUpdate={updatedVehicle => {
                  updateVehicle(index, updatedVehicle);
                }}
                onDuplicate={() => {
                  addVehicle(vehicle);
                }}
                onRemove={() => {
                  removeVehicle(index);
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
