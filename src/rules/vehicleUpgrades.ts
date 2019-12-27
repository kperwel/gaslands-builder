interface BaseUpgradeEffect<T extends string> {
  type: T;
}

interface ArmourUpgradeEffect extends BaseUpgradeEffect<"ArmourUpgradeEffect"> {
  hull: number;
}

export type VehicleUpgradeEffect = ArmourUpgradeEffect;

export interface VehicleUpgrade {
  name: string;
  abbreviation: string;
  description: string;
  effects: VehicleUpgradeEffect[];
  buildSlots: number;
  cost: number;
  canBeUsedMultipleTimes?: boolean;
}

export const vehicleUpgrades: VehicleUpgrade[] = [
  {
    name: "Armour Plating",
    abbreviation: "ap",
    description: "+2 Hull Points",
    effects: [
      {
        type: "ArmourUpgradeEffect",
        hull: 2
      }
    ],
    buildSlots: 1,
    cost: 4,
    canBeUsedMultipleTimes: true
  }
];

export interface ActiveVehicleUpgrade {
  type: VehicleUpgrade;
  amount: number;
}
