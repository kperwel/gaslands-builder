import { weaponTypes } from "./weapons";

describe("weapons", () => {
  test("weaponTypes should have unique abbreviations", () => {
    weaponTypes.forEach(type => {
      const weaponTypesWithSameAbbreviation = weaponTypes.filter(
        t => t.abbreviation === type.abbreviation
      );
      expect(weaponTypesWithSameAbbreviation.length).toBe(1);
    });
  });
});
