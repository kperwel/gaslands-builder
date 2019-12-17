import React from "react";
import { Button, ButtonGroup, Card, HTMLTable } from "@blueprintjs/core";
import { ActiveVehicle } from "./library/vehicles";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: ActiveVehicle;
  onDuplicate: () => void;
  onRemove: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onDuplicate,
  onRemove
}): React.ReactElement => {
  return (
    <Card>
      <h2>{vehicle.type.name}</h2>
      <HTMLTable interactive>
        <tbody>
          <tr>
            <td>Weight</td>
            <td>{vehicle.type.weight}</td>
          </tr>
          <tr>
            <td>Hull</td>
            <td>{vehicle.type.hull}</td>
          </tr>
          <tr>
            <td>Handling</td>
            <td>{vehicle.type.handling}</td>
          </tr>
          <tr>
            <td>Max. Gear</td>
            <td>{vehicle.type.maxGear}</td>
          </tr>
          <tr>
            <td>Crew</td>
            <td>{vehicle.type.crew}</td>
          </tr>
          <tr>
            <td>Build Slots</td>
            <td>{vehicle.type.buildSlots}</td>
          </tr>
          <tr>
            <td>Cost</td>
            <td>{vehicle.type.cost}</td>
          </tr>
          {vehicle.type.specialRule && (
            <tr className={styles.specialRule}>
              <td colSpan={2}>{vehicle.type.specialRule}</td>
            </tr>
          )}
        </tbody>
      </HTMLTable>
      <ButtonGroup>
        <Button icon="duplicate" onClick={onDuplicate}>Duplicate</Button>
        <Button icon="remove" onClick={onRemove}>Remove</Button>
      </ButtonGroup>
    </Card>
  );
};

export default VehicleCard;
