import React from "react";
import { Button, ButtonGroup, Card, Tabs, Tab, Tag } from "@blueprintjs/core";
import { ActiveVehicle } from "./rules/vehicles";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: ActiveVehicle;
  onUpdate: (vehicle: ActiveVehicle) => void;
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
      {[
        {
          value: vehicle.type.weight
        },
        {
          label: "Hull",
          value: vehicle.type.hull
        },
        {
          label: "Handling",
          value: vehicle.type.handling
        },
        {
          label: "Max. Gear",
          value: vehicle.type.maxGear
        },
        {
          label: "Crew",
          value: vehicle.type.crew
        },
        {
          label: "Build Slots",
          value: vehicle.type.buildSlots
        },
        {
          label: "Cost",
          value: vehicle.type.cost
        }
      ].map(({ label, value }) => (
        <div className={styles.propertyTag}>
          <Tag>{label ? `${label}: ${value}` : value}</Tag>
        </div>
      ))}

      {vehicle.type.specialRule && (
        <div className={styles.specialRule}>
          <td colSpan={2}>{vehicle.type.specialRule}</td>
        </div>
      )}

      <div className={styles.kitContainer}>
        <Tabs>
          <Tab
            id="weapons"
            title="Weapons"
            panel={
              <>
                <ul>
                  {vehicle.weapons.map(weapon => (
                    <li>{weapon.name}</li>
                  ))}
                </ul>
                <Button icon="add">Add Weapon</Button>
              </>
            }
          ></Tab>
          <Tab
            id="upgrade"
            title="Upgrades"
            panel={
              <>
                <Button icon="add">Add Upgrade</Button>
              </>
            }
          ></Tab>
          <Tab
            id="perks"
            title="Perks"
            panel={
              <>
                <Button icon="add">Add Perk</Button>
              </>
            }
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

export default VehicleCard;
