import { ActiveVehicle } from "../rules/vehicles";
import {
  Button,
  HTMLTable,
  Icon,
  Menu,
  Popover,
  Position
} from "@blueprintjs/core";
import * as React from "react";
import { ArcOfFireIcon } from "./ArcOfFireIcon";
import styles from "./Panel.module.css";
import {
  ActiveVehicleUpgrade,
  addUpgradeToVehicleUpgrades,
  calculateUpgradeQuantityLimit,
  getNextExclusiveFacing,
  getPossibleDirections,
  isActiveVehicleUpgradeWithFacing,
  VehicleUpgrade,
  vehicleUpgrades
} from "../rules/vehicleUpgrades";
import { isTurretMountedWeapon } from "../rules/weapons";
import assertNever from "assert-never";

function canUpgradeBeAddedToVehicle(
  upgrade: VehicleUpgrade,
  vehicle: ActiveVehicle
): boolean {
  const usedUpgrade = vehicle.upgrades.find(({ type }) => type === upgrade);

  if (!usedUpgrade) {
    return true;
  }

  switch (upgrade.quantity) {
    case "single":
      return false;
    case "unlimited":
      return true;
    case "limited":
      return (
        usedUpgrade.amount < calculateUpgradeQuantityLimit(upgrade, vehicle)
      );
    case "singleEachFacing":
      return getPossibleDirections(upgrade, vehicle.upgrades).length > 0;
    default:
      assertNever(upgrade.quantity);
  }
}

function isUpgradeIncluded(
  vehicle: ActiveVehicle,
  upgrade: ActiveVehicleUpgrade
): boolean {
  return vehicle.type.includedUpgrades.includes(upgrade.type.name);
}

interface UpgradesPanelProps {
  vehicle: ActiveVehicle;
  onUpdate: (vehicle: ActiveVehicle) => void;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  vehicle,
  onUpdate
}) => {
  return (
    <>
      {(vehicle.upgrades.length > 0 ||
        vehicle.weapons.filter(isTurretMountedWeapon).length > 0) && (
        <HTMLTable>
          <thead>
            <tr>
              <td>
                <Icon title="Upgrade" icon="asterisk" />
              </td>
              <td>
                <Icon title="Arc of fire" icon="locate" />
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
            {vehicle.upgrades.map((upgrade, index: number) => (
              <>
                <tr key={upgrade.type.abbreviation + index}>
                  <td rowSpan={upgrade.type.description ? 2 : 1}>
                    {upgrade.type.name +
                      (upgrade.amount > 1 ? ` (${upgrade.amount}×)` : "")}
                  </td>
                  <td>
                    {isActiveVehicleUpgradeWithFacing(upgrade) &&
                      upgrade.facing.type === "WeaponFacingUserSelected" && (
                        <div
                          className={styles.actionIcon}
                          onClick={() => {
                            onUpdate({
                              ...vehicle,
                              upgrades: vehicle.upgrades.map((u, i) => {
                                if (
                                  i !== index ||
                                  !isActiveVehicleUpgradeWithFacing(u)
                                ) {
                                  return u;
                                }

                                return {
                                  type: upgrade.type,
                                  amount: upgrade.amount,
                                  facing: getNextExclusiveFacing(
                                    u,
                                    vehicle.upgrades
                                  )
                                };
                              })
                            });
                          }}
                        >
                          <ArcOfFireIcon facing={upgrade.facing} />
                        </div>
                      )}
                  </td>
                  <td title="Build Slots">{upgrade.type.buildSlots}</td>
                  <td title="Cost">
                    {isUpgradeIncluded(vehicle, upgrade)
                      ? "FREE"
                      : upgrade.type.cost}
                  </td>
                  <td className={styles.tableCellControls}>
                    {upgrade.type.quantity === "unlimited" ||
                    upgrade.type.quantity === "limited" ? (
                      <>
                        {(upgrade.type.quantity === "unlimited" ||
                          (upgrade.type.quantity === "limited" &&
                            upgrade.amount <
                              calculateUpgradeQuantityLimit(
                                upgrade.type,
                                vehicle
                              ))) && (
                          <>
                            <Icon
                              className={styles.actionIcon}
                              icon="add"
                              title="Add"
                              onClick={() => {
                                onUpdate({
                                  ...vehicle,
                                  upgrades: vehicle.upgrades.map(u =>
                                    u.type === upgrade.type
                                      ? {
                                          type: upgrade.type,
                                          amount: u.amount + 1
                                        }
                                      : u
                                  )
                                });
                              }}
                            />
                            <span>&nbsp;</span>
                          </>
                        )}
                        <Icon
                          className={styles.actionIcon}
                          icon="remove"
                          title="Remove"
                          onClick={() => {
                            onUpdate({
                              ...vehicle,
                              upgrades:
                                upgrade.amount > 1
                                  ? vehicle.upgrades.map(u =>
                                      u.type === upgrade.type
                                        ? {
                                            type: upgrade.type,
                                            amount: u.amount - 1
                                          }
                                        : u
                                    )
                                  : vehicle.upgrades.filter(
                                      (v, i) => i !== index
                                    )
                            });
                          }}
                        />
                      </>
                    ) : !isUpgradeIncluded(vehicle, upgrade) ? (
                      <Icon
                        className={styles.actionIcon}
                        icon="delete"
                        title="Delete"
                        onClick={() => {
                          onUpdate({
                            ...vehicle,
                            upgrades: vehicle.upgrades.filter(
                              (v, i) => i !== index
                            )
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
                {upgrade.type.description && (
                  <tr>
                    <td className={styles.secondaryTableCell} colSpan={4}>
                      {upgrade.type.description}
                    </td>
                  </tr>
                )}
              </>
            ))}
            {vehicle.weapons
              .filter(isTurretMountedWeapon)
              .map(({ type }, index) => (
                <>
                  <tr key={type.abbreviation + index}>
                    <td rowSpan={2}>{"Turret mounting for " + type.name}</td>
                    <td>&nbsp;</td>
                    <td title="Build Slots"></td>
                    <td title="Cost">3× weapon cost</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr key={type.abbreviation + index + "d"}>
                    <td className={styles.secondaryTableCell} colSpan={4}>
                      See weapons
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </HTMLTable>
      )}
      <Popover
        content={
          <Menu>
            {vehicleUpgrades.map(upgrade => (
              <Menu.Item
                key={upgrade.name}
                text={upgrade.name}
                disabled={!canUpgradeBeAddedToVehicle(upgrade, vehicle)}
                onClick={() => {
                  onUpdate({
                    ...vehicle,
                    upgrades: addUpgradeToVehicleUpgrades(
                      vehicle.upgrades,
                      upgrade
                    )
                  });
                }}
              ></Menu.Item>
            ))}
          </Menu>
        }
        position={Position.BOTTOM}
        minimal
      >
        <Button icon="add">Add Upgrade</Button>
      </Popover>
    </>
  );
};
