import { HTMLTable, Icon } from "@blueprintjs/core";
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

export default function PrintView({ vehicle }: { vehicle: ActiveVehicle }) {
  return (
    <article className={styles.dashboard}>
      <div className={styles.name}>{vehicle.name}&nbsp;</div>
      <div className={styles.row}>
        <div className={styles.typeName}>{vehicle.type.name}</div>
        <div className={styles.weight}>{vehicle.type.weight}</div>
      </div>
      <Marker
        value={calculateTotalHull(vehicle)}
        height={calculateTotalHull(vehicle) > 7 ? 2 : 1}
      />
      {vehicle.type.specialRule ? (
        <div>Special rule: {vehicle.type.specialRule}</div>
      ) : null}
      <div className={styles.row}>
        <div className={styles.diceSlot}>
          <div>VOTES</div>
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
          </tr>
        </thead>
        <tbody>
          {vehicle.weapons.map(
            ({ type, facing }: ActiveWeapon, index: number) => (
              <React.Fragment key={type.abbreviation + index}>
                <tr>
                  <td rowSpan={type.description || type.ammo ? 2 : 1}>
                    {type.name}
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
                      {type.description}
                      <Marker value={type.ammo} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
      <ul className={styles.skills}>
        {console.log(vehicle)}
        {vehicle.weapons.map(weapon)}
        {vehicle.upgrades.map(upgrade)}
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

function Marker({ value = 1, height = 1 }) {
  return (
    <div className={styles.marker} style={{ height: `${height * 5.5}mm` }}>
      {Array(value)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={styles.box} />
        ))}
    </div>
  );
}

function weapon(
  weapon: ActiveVehicle["weapons"][number],
  i: number
): React.ReactElement {
  return (
    <li className={styles.weapon} key={`weapon-${i}`}>
      <div className={styles.weaponMeta}>
        {weapon.type.name} <span>{weapon.type.range}</span>{" "}
        <ArcOfFireIcon facing={weapon.facing} />{" "}
        <span className={styles.dice}>({weapon.type.attackDice}d6)</span>
      </div>
      {weapon.type.ammo ? <Marker value={weapon.type.ammo} /> : null}
    </li>
  );
}

function upgrade(
  upgrade: ActiveVehicle["upgrades"][number],
  i: number
): React.ReactElement {
  return (
    <li key={`upgrade-${i}`}>
      {upgrade.type.name}
      {upgrade.type.ammo ? <Marker value={upgrade.type.ammo} /> : null}
    </li>
  );
}
