import { Icon } from "@blueprintjs/core";
import { Bullet, Shield } from "../icons/icons";
import React from "react";
import {
  ActiveVehicle,
  calculateHandling,
  calculateMaxGear,
  calculateTotalCost,
  calculateTotalCrew,
  calculateTotalHull,
} from "../rules/vehicles";
import { ActiveWeapon } from "../rules/weapons";
import { ArcOfFireIcon } from "../VehicleCard/ArcOfFireIcon";
import styles from "./Dashboard.module.css";
import {
  ActiveVehicleUpgrade,
  isActiveVehicleUpgradeWithFacing,
} from "../rules/vehicleUpgrades";

export default function PrintView({ vehicle }: { vehicle: ActiveVehicle }) {
  return (
    <article className={styles.dashboard}>
      <div className={styles.name}>{vehicle.name}&nbsp;</div>
      <div className={styles.row}>
        <div className={styles.typeName}>{vehicle.type.name}</div>
        <div className={styles.weight}>{vehicle.type.weight}</div>
      </div>
      {vehicle.type.specialRule ? (
        <div>Special rule: {vehicle.type.specialRule}</div>
      ) : null}
      <div className={styles.rowRight}>
        <Marker
          variant="hull"
          render={(i) => <Shield key={i} />}
          value={calculateTotalHull(vehicle)}
        />
        <div className={styles.diceSlot}>
          <div>AUDIENCE</div>
          <div className={styles.gearValue}></div>
        </div>
        <div className={styles.diceSlot}>
          <div>MAX GEAR</div>
          <div className={styles.gearValue}>{calculateMaxGear(vehicle)}</div>
        </div>
        <div className={styles.diceSlot}>
          <div>HAZARD</div>
          <div className={styles.gearValue}></div>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Weapon</td>
            <td>
              <Icon title="Arc of fire" icon="locate" />
            </td>
            <td>
              <Icon title="Range" icon="arrows-horizontal" />
            </td>
            <td>
              <Icon title="Attack Dice" icon="cube" />
            </td>
          </tr>
        </thead>
        <tbody>
          {vehicle.weapons.map(
            ({ type, facing }: ActiveWeapon, index: number) => (
              <React.Fragment key={type.abbreviation + index}>
                <tr>
                  <td>
                    {type.name}
                    <div className={styles.specialRules}>
                      {type.specialRules.length > 0
                        ? `(${type.specialRules.join(", ")})`
                        : null}
                    </div>
                  </td>
                  <td>
                    <ArcOfFireIcon facing={facing} />
                  </td>
                  <td title="Range">{type.range}</td>
                  <td title="Attack Dice">{type.attackDice}D6</td>
                </tr>
                {(type.description || type.ammo) && (
                  <tr key={type.abbreviation + index + "d"}>
                    <td colSpan={4} className={styles.secondaryTableCell}>
                      <div className={styles.details}>
                        <div className={styles.textDetails}>
                          {type.description}
                        </div>
                        <div className={styles.ammo}>
                          <Marker
                            variant="ammo"
                            render={(i) => <Bullet key={i} />}
                            value={type.ammo}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>

      <ul className={styles.upgradesList}>
        {vehicle.upgrades.map((upgrade, index: number) => (
          <React.Fragment key={upgrade.type.abbreviation + index}>
            <li>
              {upgrade.type.name}{" "}
              {upgrade.amount > 1 ? `x${upgrade.amount}` : null}
              {isActiveVehicleUpgradeWithFacing(upgrade) ? (
                <ArcOfFireIcon facing={upgrade.facing} />
              ) : null}
              {upgrade.type.ammo ? (
                <Marker
                  variant="common"
                  render={(i) => <div className={styles.box} key={i} />}
                  value={upgrade.type.ammo}
                />
              ) : null}
            </li>
          </React.Fragment>
        ))}
      </ul>
      <div className={styles.row}>
        <div className={styles.handling}>
          HANDLING: {calculateHandling(vehicle)}
        </div>
        <div className={styles.crew}>CREW: {calculateTotalCrew(vehicle)}</div>
        <div className={styles.cost}>CANS: {calculateTotalCost(vehicle)}</div>
      </div>
    </article>
  );
}

interface MarkerPropsType {
  value?: number;
  label?: string;
  variant?: string;
  render: (index: number) => React.ReactElement;
}

function Marker({ value = 1, label, variant, render }: MarkerPropsType) {
  return (
    <div
      className={styles.marker}
      data-variant={variant}
      data-mt-10={value > 10}
    >
      {label}
      {Array(value)
        .fill(0)
        .map((_, i) => render(i))}
    </div>
  );
}
