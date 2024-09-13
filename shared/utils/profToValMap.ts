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

export function createValToProfMap(level: number): Map<number, Proficiency> {
  return new Map([
    [0, Proficiency.U],
    [2 + level, Proficiency.T],
    [4 + level, Proficiency.E],
    [6 + level, Proficiency.M],
    [8 + level, Proficiency.L],
  ]);
}
