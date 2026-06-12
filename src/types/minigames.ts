export type MiniGameKind =
  | "vocabulary-matching"
  | "lesson-sequence"
  | "grammar-challenge"
  | "behavior-management"
  | "portfolio-writing"
  | "assessment-design"
  | "time-management"
  | "micro-teaching"
  | "classroom-simulation"
  | "final-inspection";

interface MiniGameBase {
  kind: MiniGameKind;
  title: string;
  instructions: string;
}

/** Match each word with its picture (emoji). */
export interface VocabularyMatchingConfig extends MiniGameBase {
  kind: "vocabulary-matching";
  pairs: { word: string; emoji: string }[];
}

/** Arrange lesson stages into the correct pedagogical order. */
export interface LessonSequenceConfig extends MiniGameBase {
  kind: "lesson-sequence";
  /** Stages listed in the CORRECT order; presented shuffled. */
  correctOrder: { id: string; label: string; detail: string }[];
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Multiple-choice quiz (grammar, ethics, methodology...). */
export interface GrammarChallengeConfig extends MiniGameBase {
  kind: "grammar-challenge";
  questions: QuizQuestion[];
}

export interface BehaviorScenario {
  situation: string;
  options: { text: string; quality: 0 | 1 | 2; feedback: string }[];
}

/** React to live classroom situations. */
export interface BehaviorManagementConfig extends MiniGameBase {
  kind: "behavior-management";
  scenarios: BehaviorScenario[];
}

/** Pick the strongest reflections for the portfolio. */
export interface PortfolioWritingConfig extends MiniGameBase {
  kind: "portfolio-writing";
  prompts: {
    topic: string;
    options: { text: string; quality: 0 | 1 | 2; feedback: string }[];
  }[];
}

export interface AssessmentItem {
  text: string;
  /** Which bucket the item belongs to. */
  bucket: "assessment" | "evaluation" | "testing";
}

/** Sort concepts into Assessment / Evaluation / Testing. */
export interface AssessmentDesignConfig extends MiniGameBase {
  kind: "assessment-design";
  items: AssessmentItem[];
}

/** Finish observation sheets before the deadline while managing energy. */
export interface TimeManagementConfig extends MiniGameBase {
  kind: "time-management";
  /** Total sheets to complete. */
  sheetTarget: number;
  /** Seconds on the clock. */
  timeLimit: number;
}

/** Build a micro-lesson by choosing methods while nerves rise. */
export interface MicroTeachingConfig extends MiniGameBase {
  kind: "micro-teaching";
  rounds: {
    moment: string;
    options: { text: string; quality: 0 | 1 | 2; feedback: string }[];
  }[];
}

/** Run a full simulated class period balancing engagement and order. */
export interface ClassroomSimulationConfig extends MiniGameBase {
  kind: "classroom-simulation";
  events: {
    description: string;
    options: {
      text: string;
      engagementDelta: number;
      orderDelta: number;
      feedback: string;
    }[];
  }[];
}

/** Casablanca final exam — six weighted sections of questions. */
export interface FinalInspectionConfig extends MiniGameBase {
  kind: "final-inspection";
  sections: {
    name: string;
    questions: QuizQuestion[];
  }[];
}

export type MiniGameConfig =
  | VocabularyMatchingConfig
  | LessonSequenceConfig
  | GrammarChallengeConfig
  | BehaviorManagementConfig
  | PortfolioWritingConfig
  | AssessmentDesignConfig
  | TimeManagementConfig
  | MicroTeachingConfig
  | ClassroomSimulationConfig
  | FinalInspectionConfig;

export interface MiniGameResult {
  /** Normalized 0-100. */
  score: number;
  /** Short human-readable performance summary. */
  summary: string;
}
