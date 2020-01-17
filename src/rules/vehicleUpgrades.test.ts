import { vehicleUpgrades } from "./vehicleUpgrades";

describe("vehicleUpgrades", () => {
  test("vehicleUpgrades should have unique abbreviations", () => {
    vehicleUpgrades.forEach(type => {
      const vehiclesWithSameAbbreviation = vehicleUpgrades.filter(
        u => u.abbreviation === type.abbreviation
      );
      expect(vehiclesWithSameAbbreviation).toEqual([type]);
    });
  });
});
