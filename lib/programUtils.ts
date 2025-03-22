import programsData from "@/components/Programs/programsData";

export function getAllPrograms() {
  return programsData;
}

export function getProgramBySlug(slug: string) {
  return programsData.find((program) => program.slug === slug);
}

export function getRecentPrograms(count: number = 3) {
  return programsData.slice(0, count);
}
