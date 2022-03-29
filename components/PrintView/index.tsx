import { Team } from "../team";
import Dashboard from "./Dashboard";
import QRCode from "react-qr-code";

import styles from "./PrintView.module.css";

export default function PrintView({ team }: { team: Team }) {
  return (
    <div>
      <h1>{team.name}</h1>
      <div className={styles.printList}>
        {team.vehicles.map((v, i) => (
          <Dashboard key={i} vehicle={v} />
        ))}
      </div>
      <QRCode
        className={styles.qr}
        value={typeof window !== "undefined" ? window.location.href : ""}
        size={128}
      />
    </div>
  );
}
