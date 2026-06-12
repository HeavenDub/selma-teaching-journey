"use client";

import type { MiniGameConfig, MiniGameResult } from "@/types";
import { QuizGame } from "./QuizGame";
import { ScenarioGame } from "./ScenarioGame";
import { VocabularyMatchingGame } from "./VocabularyMatchingGame";
import { LessonSequenceGame } from "./LessonSequenceGame";
import { AssessmentDesignGame } from "./AssessmentDesignGame";
import { TimeManagementGame } from "./TimeManagementGame";
import { ClassroomSimulationGame } from "./ClassroomSimulationGame";
import { FinalInspectionGame } from "./FinalInspectionGame";

interface MiniGameHostProps {
  config: MiniGameConfig;
  onComplete: (result: MiniGameResult) => void;
}

/** Routes a quest's minigame config to the matching game engine. */
export function MiniGameHost({ config, onComplete }: MiniGameHostProps) {
  switch (config.kind) {
    case "vocabulary-matching":
      return <VocabularyMatchingGame config={config} onComplete={onComplete} />;
    case "lesson-sequence":
      return <LessonSequenceGame config={config} onComplete={onComplete} />;
    case "grammar-challenge":
      return (
        <QuizGame
          title={config.title}
          instructions={config.instructions}
          questions={config.questions}
          onComplete={onComplete}
        />
      );
    case "behavior-management":
      return (
        <ScenarioGame
          title={config.title}
          instructions={config.instructions}
          roundLabel="Situation"
          rounds={config.scenarios.map((s) => ({
            prompt: s.situation,
            options: s.options,
          }))}
          onComplete={onComplete}
        />
      );
    case "micro-teaching":
      return (
        <ScenarioGame
          title={config.title}
          instructions={config.instructions}
          roundLabel="Moment"
          rounds={config.rounds.map((r) => ({
            prompt: r.moment,
            options: r.options,
          }))}
          onComplete={onComplete}
        />
      );
    case "portfolio-writing":
      return (
        <ScenarioGame
          title={config.title}
          instructions={config.instructions}
          roundLabel="Section"
          rounds={config.prompts.map((p) => ({
            prompt: p.topic,
            options: p.options,
          }))}
          onComplete={onComplete}
        />
      );
    case "assessment-design":
      return <AssessmentDesignGame config={config} onComplete={onComplete} />;
    case "time-management":
      return <TimeManagementGame config={config} onComplete={onComplete} />;
    case "classroom-simulation":
      return <ClassroomSimulationGame config={config} onComplete={onComplete} />;
    case "final-inspection":
      return <FinalInspectionGame config={config} onComplete={onComplete} />;
  }
}
