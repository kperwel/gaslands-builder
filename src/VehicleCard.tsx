import React from "react";
import { ActiveVehicle } from "./library/vehicles";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: ActiveVehicle;
  removeVehicle: (vehicle: ActiveVehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  removeVehicle
}): React.ReactElement => {
  return (
    <div className={styles.wrapper}>
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
  );
};

export default VehicleCard;
