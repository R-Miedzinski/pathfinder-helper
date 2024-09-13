export default function stringSort(a: string, b: string): number {
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();
  return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}
