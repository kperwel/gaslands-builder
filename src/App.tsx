import React from 'react';
import styles from './App.module.css';
import nanoId from 'nanoid';

interface ActiveVehicle {
  id: string
}

interface AddVehicleAction {
  type: 'addVehicle'
  vehicle: ActiveVehicle
}

interface RemoveVehicleAction {
  type: 'removeVehicle'
  vehicleId: string
}

type VehicleAction = AddVehicleAction | RemoveVehicleAction;

const App: React.FC = (): React.ReactElement => {

  const reducer = (state: ActiveVehicle[], action: VehicleAction) => {
    switch (action.type) {
      case 'addVehicle':
        return [...state, action.vehicle];
      case 'removeVehicle':
        return state.filter(({id}) => id !== action.vehicleId);
      default:
        throw new Error(`unknown vhicle reducer action: ${action}`);
    }
  };

  const [vehicles, dispatchVehicleAction] = React.useReducer(reducer, []);

  const addVehicle = (vehicle: ActiveVehicle) => {
    dispatchVehicleAction({type: 'addVehicle', vehicle});
  };

  const removeVehicle = (vehicleId: string) => {
    dispatchVehicleAction({type: 'removeVehicle', vehicleId: vehicleId});
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Gaslands Builder</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.controls}>
          <button onClick={() => addVehicle({id: nanoId()})}>Add vehicle
          </button>
        </div>
        <div className={styles.vehiclesContainer}>
          {vehicles.map(vehicle => (
            <div className={styles.vehicle}>
              Vehicle {vehicle.id}
              <button onClick={() => removeVehicle(vehicle.id)}>Remove</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
