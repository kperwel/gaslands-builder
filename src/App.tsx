import React from "react";
import styles from "./App.module.css";
import { vehicleTypes, ActiveVehicle } from "./library/vehicles";
import VehicleCard from "./VehicleCard";

interface AddVehicleAction {
  type: "addVehicle";
  vehicle: ActiveVehicle;
}

interface RemoveVehicleAction {
  type: "removeVehicle";
  vehicle: ActiveVehicle;
}

type VehicleAction = AddVehicleAction | RemoveVehicleAction;

const App: React.FC = (): React.ReactElement => {
  const reducer = (state: ActiveVehicle[], action: VehicleAction) => {
    switch (action.type) {
      case "addVehicle":
        return [...state, action.vehicle];
      case "removeVehicle":
        return state.filter(vehicle => vehicle !== action.vehicle);
      default:
        throw new Error(`unknown vhicle reducer action: ${action}`);
    }
  };

  const [vehicles, dispatchVehicleAction] = React.useReducer(reducer, []);

  const addVehicle = (vehicle: ActiveVehicle) => {
    dispatchVehicleAction({ type: "addVehicle", vehicle });
  };

  const removeVehicle = (vehicle: ActiveVehicle) => {
    dispatchVehicleAction({ type: "removeVehicle", vehicle });
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Gaslands Builder</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.controls}>
          <button
            onClick={() =>
              addVehicle({
                type:
                  vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
              })
            }
          >
            Add vehicle
          </button>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map(vehicle => VehicleCard({ vehicle, removeVehicle }))}
        </div>
      </main>
    </div>
  );
};

export default App;
