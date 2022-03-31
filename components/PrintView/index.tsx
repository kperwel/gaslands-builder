import { Team } from "../team";
import Dashboard from "./Dashboard";
import QRCode from "react-qr-code";

import styles from "./PrintView.module.css";

export default function PrintView({ team }: { team: Team }) {
  return (
    <div className={styles.printContent}>
      <h1 className={styles.name}>{team.name}</h1>
      <div className={styles.printList}>
        {team.vehicles.map((v, i) => (
          <Dashboard key={i} vehicle={v} />
        ))}
        
        <QRCode
          className={styles.qr}
          value={typeof window !== "undefined" ? window.location.href : ""}
          size={128}
        />
      </div>
    </div>
  );
}
