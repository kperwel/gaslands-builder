import { WeaponFacing } from "../rules/facing";
import { Icon } from "@blueprintjs/core";
import * as React from "react";
import assertNever from "assert-never";

interface Props {
  facing: WeaponFacing;
}

export const ArcOfFireIcon: React.FC<Props> = ({ facing }) => {
  switch (facing.direction) {
    case "front":
      return <Icon icon="arrow-up" title="front" />;
    case "rear":
      return <Icon icon="arrow-down" title="rear" />;
    case "side":
      return <Icon icon="arrows-horizontal" title="sides" />;
    case "360°":
      return (
        <Icon
          icon={"circle"}
          intent={
            facing.type === "WeaponFacingUserSelected" ? "success" : "none"
          }
          title={
            facing.type === "WeaponFacingUserSelected"
              ? "Turret mounted for 3× price"
              : "360°"
          }
        />
      );
    default:
      assertNever(facing);
  }
};
