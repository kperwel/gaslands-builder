import React from "react";
import styles from "./App.module.css";
import { ActiveVehicle, vehicleTypes } from "./rules/vehicles";
import VehicleCard from "./VehicleCard";
import {
  Button,
  EditableText,
  Menu,
  Navbar,
  Popover,
  Position
} from "@blueprintjs/core";
import { useQueryStringReducer } from "./queryString";
import { defaultWeaponTypes } from "./rules/weapons";
import reducer from "./teamReducer";
import {
  calculateTotalTeamCost,
  INITIAL_TEAM,
  teamCondensationIsomorphism
} from "./team";
import {
  ActiveVehicleUpgrade,
  addUpgradeToVehicleUpgrades,
  vehicleUpgrades
} from "./rules/vehicleUpgrades";

const App: React.FC = (): React.ReactElement => {
  const [team, dispatchTeamAction] = useQueryStringReducer(
    reducer,
    INITIAL_TEAM,
    teamCondensationIsomorphism
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
                    onClick={() => {
                      addVehicle({
                        type,
                        weapons: defaultWeaponTypes.map(type => ({
                          type,
                          facing: type.isCrewFired
                            ? {
                                type: "WeaponFacingCrewFired",
                                direction: "360°"
                              }
                            : {
                                type: "WeaponFacingUserSelected",
                                direction: "front"
                              }
                        })),
                        upgrades: type.includedUpgrades.reduce(
                          (acc, upgrade) => {
                            const upgradeType = vehicleUpgrades.find(
                              u => u.name === upgrade
                            );
                            return upgradeType
                              ? addUpgradeToVehicleUpgrades(acc, upgradeType)
                              : acc;
                          },
                          [] as ActiveVehicleUpgrade[]
                        )
                      });
                    }}
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
      <div className={styles.footer}>
        <a
          href="https://gaslands.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gaslands
        </a>
        , the amazing tabletop game, and all properties belong to Mike
        Hutchinson.
        <br />
        Gaslands Builder is built by{" "}
        <a
          href="https://twitter.com/bfncs"
          target="_blank"
          rel="noopener noreferrer"
        >
          bfncs
        </a>
        .<br />
        Issues? Report and contribute on{" "}
        <a
          href="https://github.com/bfncs/gaslands-builder"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        .<br />
      </div>
    </div>
  );
};

export default App;
