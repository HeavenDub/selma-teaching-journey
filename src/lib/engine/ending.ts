import type { EndingResult, GameSnapshot } from "@/types";
import { journeyReadiness } from "./progression";

/**
 * The final outcome blends the inspection exam itself with the whole
 * journey: stats built across cities and the quality of every quest run.
 */
export function resolveEnding(
  snapshot: GameSnapshot,
  inspectionExamScore: number,
): EndingResult {
  const readiness = journeyReadiness(snapshot);
  const finalScore = Math.round(inspectionExamScore * 0.6 + readiness * 0.4);

  if (finalScore >= 80) {
    return {
      grade: "A",
      title: "Outstanding Teacher",
      inspectionScore: finalScore,
      certified: true,
    };
  }
  if (finalScore >= 55) {
    return {
      grade: "B",
      title: "Promising Teacher",
      inspectionScore: finalScore,
      certified: true,
    };
  }
  return {
    grade: "C",
    title: "Needs More Experience",
    inspectionScore: finalScore,
    certified: false,
  };
}

export const ENDING_DESCRIPTIONS: Record<EndingResult["grade"], string> = {
  A: "Inspector Tazi sets down his pen, stands, and — witnesses will confirm — smiles. 'Outstanding. In one thousand four hundred and twelve inspections, I have written that word eleven times. Twelve, now.' Selma is certified with distinction. Casablanca has a new English teacher, and somewhere in El Jadida, a boy named Amine begins telling everyone he knew her first.",
  B: "Inspector Tazi nods slowly over the final page. 'A promising teacher. The foundations are sound, the heart is evident, and the rest is Mondays.' Selma is certified. The road from Safi has delivered her exactly where she dreamed — at the beginning of everything.",
  C: "Inspector Tazi closes the file gently. 'Not yet — and I want you to hear the second word more than the first. More experience will turn these gaps into strengths. Most of the finest teachers I know did not pass cleanly the first time.' The journey continues; the dream remains. Selma will be back.",
};
