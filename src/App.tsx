import React from "react";
import styles from "./App.module.css";
import { ActiveVehicle, vehicleTypes } from "./rules/vehicles";
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
import { defaultWeaponTypes } from "./rules/weapons";
import reducer from "./teamReducer";
import {
  calculateTotalTeamCost,
  INITIAL_TEAM,
  teamCondensationIsomorphism
} from "./team";

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
