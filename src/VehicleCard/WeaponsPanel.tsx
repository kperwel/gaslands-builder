import { ActiveVehicle } from "../rules/vehicles";
import {
  Button,
  HTMLTable,
  Icon,
  Popover,
  Position,
  Menu
} from "@blueprintjs/core";
import * as React from "react";
import {
  ActiveWeapon,
  calculateActiveWeaponCost,
  weaponTypes
} from "../rules/weapons";
import { ArcOfFireIcon } from "./ArcOfFireIcon";
import styles from "./WeaponsPanel.module.css";
import { getNextFacing } from "../rules/facing";

interface WeaponsPanelProps {
  vehicle: ActiveVehicle;
  onUpdate: (vehicle: ActiveVehicle) => void;
}

export const WeaponsPanel: React.FC<WeaponsPanelProps> = ({
  vehicle,
  onUpdate
}) => {
  return (
    <>
      <HTMLTable>
        <thead>
          <tr>
            <td>
              <Icon title="Weapon" icon="ninja" />
            </td>
            <td>
              <Icon title="Arc of fire" icon="locate" />
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
                <td>
                  {facing.type !== "WeaponFacingUserSelected" ? (
                    <ArcOfFireIcon facing={facing} />
                  ) : (
                    <div
                      className={styles.actionIcon}
                      onClick={() => {
                        onUpdate({
                          ...vehicle,
                          weapons: vehicle.weapons.map((w, i) => {
                            if (i !== index) {
                              return w;
                            }
                            return {
                              type: w.type,
                              facing: getNextFacing(w.facing)
                            };
                          })
                        });
                      }}
                    >
                      <ArcOfFireIcon facing={facing} />
                    </div>
                  )}
                </td>
                <td title="Range">{type.range}</td>
                <td title="Attack Dice">{type.attackDice}D6</td>
                <td title="Build Slots">{type.buildSlots}</td>
                <td title="Cost">
                  {calculateActiveWeaponCost({ type, facing })}
                </td>
                <td>
                  {!type.isDefault && (
                    <Icon
                      className={styles.actionIcon}
                      icon="delete"
                      onClick={() => {
                        onUpdate({
                          ...vehicle,
                          weapons: vehicle.weapons.filter((v, i) => i !== index)
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
              .filter(weapon => !weapon.isDefault)
              .map(weapon => (
                <Menu.Item
                  key={weapon.name}
                  text={weapon.name}
                  onClick={() =>
                    onUpdate({
                      ...vehicle,
                      weapons: [
                        ...vehicle.weapons,
                        {
                          type: weapon,
                          facing: weapon.isCrewFired
                            ? {
                                type: "WeaponFacingCrewFired",
                                direction: "360°"
                              }
                            : {
                                type: "WeaponFacingUserSelected",
                                direction: "front"
                              }
                        }
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
  );
};
