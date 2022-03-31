import { Menu } from "@blueprintjs/core";
import styles from "./ScrollableMenu.module.css";
import React from "react";

interface ScrollableMenuProps {
  children: React.ReactNode;
}

export default function ScrollableMenu({
  children,
}: ScrollableMenuProps): JSX.Element {
  return (
    <div className={styles.menuOverflow}>
      <Menu>{children}</Menu>
    </div>
  );
}
