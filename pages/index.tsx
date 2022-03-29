import React from "react";
import styles from "../components/App.module.css";
import { ActiveVehicle, vehicleTypes } from "../components/rules/vehicles";
import {
  Alignment,
  Button,
  EditableText,
  Menu,
  MenuItem,
  Navbar,
  Position,
} from "@blueprintjs/core";
import { useQueryStringReducer } from "../components/queryString";
import { defaultWeaponTypes } from "../components/rules/weapons";
import reducer from "../components/teamReducer";
import {
  calculateTotalTeamCost,
  INITIAL_TEAM,
  teamCondensationIsomorphism,
} from "../components/team";
import {
  ActiveVehicleUpgrade,
  addUpgradeToVehicleUpgrades,
  vehicleUpgrades,
} from "../components/rules/vehicleUpgrades";
import { NextPage } from "next";
import { Popover2 } from "@blueprintjs/popover2";
import useTheme from "../components/useTheme";
import useDetectPrint from "../components/PrintView/useDetectPrint";
import PrintView from "../components/PrintView/index";
import { VehicleCard } from "../components/VehicleCard";
import { generateCarName } from "../components/names";

const App: NextPage = (): React.ReactElement => {
  const { isDark, toggleTheme } = useTheme();
  const [team, dispatchTeamAction] = useQueryStringReducer(
    reducer,
    INITIAL_TEAM,
    teamCondensationIsomorphism
  );

  const isPrinting = useDetectPrint();

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

  const updateVehicleName = (index: number, name: string): void => {
    dispatchTeamAction({ type: "updateVehicleName", index, name });
  };

  return isPrinting ? (
    <PrintView team={team} />
  ) : (
    <div className={`${styles.wrapper} ${isDark ? "bp4-dark" : ""}`}>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>Gaslands Builder</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button icon={isDark ? "lightbulb" : "moon"} onClick={toggleTheme} />
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

          <Popover2
            content={
              <Menu>
                {vehicleTypes.map((type) => (
                  <MenuItem
                    key={type.name}
                    text={type.name}
                    onClick={() => {
                      addVehicle({
                        name: generateCarName(),
                        type,
                        weapons: defaultWeaponTypes.map((type) => ({
                          type,
                          facing: type.isCrewFired
                            ? {
                                type: "WeaponFacingCrewFired",
                                direction: "360°",
                              }
                            : {
                                type: "WeaponFacingUserSelected",
                                direction: "front",
                              },
                        })),
                        upgrades: (type.includedUpgrades || []).reduce(
                          (acc, upgrade) => {
                            const upgradeType = vehicleUpgrades.find(
                              (u) => u.name === upgrade
                            );
                            return upgradeType
                              ? addUpgradeToVehicleUpgrades(acc, upgradeType)
                              : acc;
                          },
                          [] as ActiveVehicleUpgrade[]
                        ),
                      });
                    }}
                  ></MenuItem>
                ))}
              </Menu>
            }
            position={Position.BOTTOM}
            minimal
          >
            <Button>Add vehicle</Button>
          </Popover2>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map((vehicle, index) => (
            <div
              className={styles.vehiclesItem}
              key={`${vehicle.type}-${index}`}
            >
              <h2>
                <EditableText
                  maxLength={80}
                  value={vehicle.name}
                  onChange={(name) => updateVehicleName(index, name)}
                >
                  New Car
                </EditableText>
              </h2>{" "}
              <VehicleCard
                vehicle={vehicle}
                onUpdate={(updatedVehicle) => {
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
        </a>{" "}
        and{" "}
        <a
          href="https://twitter.com/kperwel"
          target="_blank"
          rel="noopener noreferrer"
        >
          kperwel
        </a>
        .<br />
        Issues? Report and contribute on{" "}
        <a
          href="https://github.com/kperwel/gaslands-builder"
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
