import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Intent,
  Tab,
  Tabs,
  Tag
} from "@blueprintjs/core";
import {
  ActiveVehicle,
  calculateBuildSlotsInUse,
  calculateHandling,
  calculateMaxGear,
  calculateTotalCost,
  calculateTotalCrew,
  calculateTotalHull
} from "../rules/vehicles";
import styles from "./VehicleCard.module.css";
import { WeaponsPanel } from "./WeaponsPanel";
import { UpgradesPanel } from "./UpgradesPanel";

interface VehicleCardProps {
  vehicle: ActiveVehicle;
  onUpdate: (vehicle: ActiveVehicle) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

function buildTabTitle(title: string, items: Array<Object>): string {
  if (!items || items.length === 0) {
    return title;
  }

  return `${title} (${items.length})`;
}

interface VehiclePropertyTagProps {
  value: string | number;
  label?: string;
  intent?: Intent;
}
const PropertyTag: React.FC<VehiclePropertyTagProps> = ({
  label,
  value,
  intent
}): React.ReactElement => (
  <div className={styles.propertyTag} key={(label || "") + value}>
    <Tag intent={intent}>{label ? `${label}: ${value}` : value}</Tag>
  </div>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onUpdate,
  onDuplicate,
  onRemove
}): React.ReactElement => {
  const buildSlotsInUse = calculateBuildSlotsInUse(vehicle);
  return (
    <Card className={styles.card} elevation={Elevation.TWO}>
      <h3>{vehicle.type.name}</h3>
      <PropertyTag label="Cost" value={calculateTotalCost(vehicle)} />
      <PropertyTag
        label="Build Slots"
        value={
          buildSlotsInUse > 0
            ? `${buildSlotsInUse}/${vehicle.type.buildSlots}`
            : vehicle.type.buildSlots
        }
        intent={buildSlotsInUse > vehicle.type.buildSlots ? "danger" : "none"}
      />
      <PropertyTag label="Hull" value={calculateTotalHull(vehicle)} />
      <PropertyTag label="Handling" value={calculateHandling(vehicle)} />
      <PropertyTag label="Max. Gear" value={calculateMaxGear(vehicle)} />
      <PropertyTag label="Crew" value={calculateTotalCrew(vehicle)} />
      <PropertyTag value={vehicle.type.weight} />

      {vehicle.type.specialRule && (
        <div className={styles.specialRule}>{vehicle.type.specialRule}</div>
      )}

      <div className={styles.kitContainer}>
        <Tabs>
          <Tab
            id="weapons"
            title={buildTabTitle("Weapons", vehicle.weapons)}
            panel={<WeaponsPanel vehicle={vehicle} onUpdate={onUpdate} />}
          ></Tab>
          <Tab
            id="upgrade"
            title={buildTabTitle("Upgrades", vehicle.upgrades)}
            panel={<UpgradesPanel vehicle={vehicle} onUpdate={onUpdate} />}
          ></Tab>
        </Tabs>
      </div>

      <ButtonGroup>
        <Button icon="remove" onClick={onRemove}>
          Remove
        </Button>
        <Button icon="duplicate" onClick={onDuplicate}>
          Duplicate
        </Button>
      </ButtonGroup>
    </Card>
  );
};
