import { vehicleTypes } from "./vehicles";

describe("vehicles", () => {
  test("vehicleTypes should have unique abbreviations", () => {
    vehicleTypes.forEach(type => {
      const vehiclesWithSameAbbreviation = vehicleTypes.filter(
        t => t.abbreviation === type.abbreviation
      );
      expect(vehiclesWithSameAbbreviation).toEqual([type]);
    });
  });
});
