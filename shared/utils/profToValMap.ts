import { Proficiency } from "../public-api";

export function createProfToValMap(level: number): Map<Proficiency, number> {
  return new Map([
    [Proficiency.U, 0],
    [Proficiency.T, 2 + level],
    [Proficiency.E, 4 + level],
    [Proficiency.M, 6 + level],
    [Proficiency.L, 8 + level],
  ]);
}
