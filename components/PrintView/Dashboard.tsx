import {
  ActiveVehicle,
  calculateHandling,
  calculateMaxGear,
  calculateTotalCost,
  calculateTotalCrew,
  calculateTotalHull,
} from "../rules/vehicles";
import styles from "./Dashboard.module.css";

export default function PrintView({ vehicle }: { vehicle: ActiveVehicle }) {
  return (
    <article className={styles.dashboard}>
      <div className={styles.name}>{vehicle.name}&nbsp;</div>
      <div className={styles.row}>
        <div className={styles.typeName}>{vehicle.type.name}</div>
        <div className={styles.weight}>{vehicle.type.weight}</div>
      </div>
      <Marker value={calculateTotalHull(vehicle)} height={calculateTotalHull(vehicle) > 7 ? 2 : 1} />
      {vehicle.type.specialRule ? (
        <div>Special rule: {vehicle.type.specialRule}</div>
      ) : null}
      <div className={styles.row}>
        <ul className={styles.skills}>
          {vehicle.weapons.map(weapon)}
          {vehicle.upgrades.map(upgrade)}
        </ul>
        <div className={styles.gear}>
          <div>MAX GEAR:</div>
          <div className={styles.gearValue}>{calculateMaxGear(vehicle)}</div>
        </div>
      </div>
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
      <div className={styles.weaponMeta}>{weapon.type.name} <span className={styles.dice}>({weapon.type.attackDice}d6)</span></div> 
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
