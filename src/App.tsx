import React from "react";
import styles from "./App.module.css";
import { ActiveVehicle, vehicleTypes } from "./library/vehicles";
import VehicleCard from "./VehicleCard";
import { Button, Menu, Navbar, Popover, Position } from "@blueprintjs/core";

interface AddVehicleAction {
  type: "addVehicle";
  vehicle: ActiveVehicle;
}

interface RemoveVehicleAction {
  type: "removeVehicle";
  index: number;
}

type VehicleAction = AddVehicleAction | RemoveVehicleAction;

const App: React.FC = (): React.ReactElement => {
  const reducer = (state: ActiveVehicle[], action: VehicleAction) => {
    switch (action.type) {
      case "addVehicle":
        return [...state, action.vehicle];
      case "removeVehicle":
        return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1)
        ];
      default:
        throw new Error(`unknown vhicle reducer action: ${action}`);
    }
  };

  const [vehicles, dispatchVehicleAction] = React.useReducer(reducer, []);

  const addVehicle = (vehicle: ActiveVehicle): void => {
    dispatchVehicleAction({ type: "addVehicle", vehicle });
  };

  const removeVehicle = (index: number): void => {
    dispatchVehicleAction({ type: "removeVehicle", index });
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
          <Popover
            content={
              <Menu>
                {vehicleTypes.map(type => (
                  <Menu.Item
                    text={type.name}
                    onClick={() =>
                      addVehicle({
                        type
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
            <div className={styles.vehiclesItem}>
              <VehicleCard
                vehicle={vehicle}
                onDuplicate={() => {
                  addVehicle(vehicle);
                }}
                onRemove={() => {
                  removeVehicle(index);
                }}
                key={`${vehicle.type}-${index}`}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
