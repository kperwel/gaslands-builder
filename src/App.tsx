import React from "react";
import styles from "./App.module.css";
import { VehicleType, vehicleTypes } from "./library/vehicles";

interface ActiveVehicle {
  type: VehicleType;
}

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
        return state.filter((vehicle) => vehicle !== action.vehicle);
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
            onClick={() => addVehicle({ type: vehicleTypes[Math.floor(Math.random()*vehicleTypes.length)] })}
          >
            Add vehicle
          </button>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map(vehicle => (
            <div className={styles.vehicle}>
              <h3>{vehicle.type.name}</h3>
              <dl>
                <dt>Weight</dt>
                <dd>{vehicle.type.weight}</dd>
                <dt>Hull</dt>
                <dd>{vehicle.type.hull}</dd>
                <dt>Handling</dt>
                <dd>{vehicle.type.handling}</dd>
                <dt>Max. Gear</dt>
                <dd>{vehicle.type.maxGear}</dd>
                <dt>Crew</dt>
                <dd>{vehicle.type.crew}</dd>
                <dt>Build Slots</dt>
                <dd>{vehicle.type.buildSlots}</dd>
                <dt>Cost</dt>
                <dd>{vehicle.type.cost}</dd>
              </dl>
              {vehicle.type.specialRule && <p>{vehicle.type.specialRule}</p>}
              <button onClick={() => removeVehicle(vehicle)}>Remove</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
