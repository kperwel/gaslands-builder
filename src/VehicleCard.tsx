import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Tabs,
  Tab,
  Tag,
  HTMLTable,
  Icon,
  Menu,
  Popover,
  Position
} from "@blueprintjs/core";
import { ActiveVehicle, calculateTotalCost } from "./rules/vehicles";
import styles from "./VehicleCard.module.css";
import { ActiveWeapon, weaponTypes } from "./rules/weapons";

interface VehicleCardProps {
  vehicle: ActiveVehicle;
  onUpdate: (vehicle: ActiveVehicle) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

function buildTabTitle(title: string, items: Array<Object>) {
  if (!items) {
    return title;
  }

  return `${title} (${items.length})`;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onUpdate,
  onDuplicate,
  onRemove
}): React.ReactElement => {
  return (
    <Card>
      <h2>
        {vehicle.type.name} ({calculateTotalCost(vehicle)} cans)
      </h2>
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
            title={buildTabTitle("Weapons", vehicle.weapons)}
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
                      <td>&nbsp;</td>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicle.weapons.map(
                      ({ type, facing }: ActiveWeapon, index: number) => (
                        <tr key={type.abbreviation + index}>
                          <td>{type.name}</td>
                          <td title="Range">{type.range}</td>
                          <td title="Attack Dice">{type.attackDice}D6</td>
                          <td title="Build Slots">{type.buildSlots}</td>
                          <td title="Cost">{type.cost}</td>
                          <td>
                            {!type.nonRemovable && (
                              <Icon
                                icon="delete"
                                onClick={() => {
                                  onUpdate({
                                    ...vehicle,
                                    weapons: vehicle.weapons.filter(
                                      (v, i) => i !== index
                                    )
                                  });
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </HTMLTable>
                <Popover
                  content={
                    <Menu>
                      {weaponTypes
                        .filter(weapon => !weapon.nonRemovable)
                        .map(weapon => (
                          <Menu.Item
                            key={weapon.name}
                            text={weapon.name}
                            onClick={() =>
                              onUpdate({
                                ...vehicle,
                                weapons: [
                                  ...vehicle.weapons,
                                  { type: weapon, facing: "front" }
                                ]
                              })
                            }
                          ></Menu.Item>
                        ))}
                    </Menu>
                  }
                  position={Position.BOTTOM}
                  minimal
                >
                  <Button icon="add">Add Weapon</Button>
                </Popover>
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
