import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Tabs,
  Tab,
  Tag,
  HTMLTable,
  Icon
} from "@blueprintjs/core";
import { ActiveVehicle } from "./rules/vehicles";
import styles from "./VehicleCard.module.css";
import { WeaponType } from "./rules/weapons";

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
        <div className={styles.propertyTag} key={(label || "") + value}>
          <Tag>{label ? `${label}: ${value}` : value}</Tag>
        </div>
      ))}

      {vehicle.type.specialRule && (
        <div className={styles.specialRule}>{vehicle.type.specialRule}</div>
      )}

      <div className={styles.kitContainer}>
        <Tabs>
          <Tab
            id="weapons"
            title="Weapons"
            panel={
              <>
                <HTMLTable>
                  <thead>
                    <tr>
                      <td>
                        <Icon title="Weapon" icon="ninja" />
                      </td>
                      <td>
                        <Icon title="Range" icon="arrows-horizontal" />
                      </td>
                      <td>
                        <Icon title="Attack Dice" icon="cube" />
                      </td>
                      <td>
                        <Icon title="Build Slots" icon="cog" />
                      </td>
                      <td>
                        <Icon title="Cost" icon="dollar" />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicle.weapons.map(
                      (weapon: WeaponType, index: number) => (
                        <tr key={weapon.abbreviation + index}>
                          <td>{weapon.name}</td>
                          <td title="Range">{weapon.range}</td>
                          <td title="Attack Dice">{weapon.attackDice}D6</td>
                          <td title="Build Slots">{weapon.buildSlots}</td>
                          <td title="Cost">{weapon.cost}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </HTMLTable>
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
