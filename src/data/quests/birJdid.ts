import type { QuestDefinition } from "@/types";

export const BIR_JDID_QUESTS: QuestDefinition[] = [
  {
    id: "assessment-master",
    cityId: "bir-jdid",
    title: "Assessment Master",
    category: "assessment-task",
    difficulty: 4,
    summary: "Sort assessment from evaluation from testing under Mr. Tahiri's green pen — then build a fair quiz.",
    story:
      "In Bir Jdid, Mr. Tahiri asks every trainee the question that ends careers and starts them: 'But what are you measuring?' Selma must untangle three words the whole profession confuses — assessment, evaluation, testing — until the difference is reflex.",
    objectives: [
      { id: "o1", description: "Distinguish assessment, evaluation, and testing" },
      { id: "o2", description: "Sort the toolbox: every concept in its right bucket" },
      { id: "o3", description: "Earn the Assessment Toolkit" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-assessment-master-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "assessment-design",
          title: "Sort the Toolbox",
          instructions:
            "Drop each concept into the right bucket. Assessment = ongoing gathering of evidence during learning. Evaluation = judging worth or level against criteria. Testing = a specific measuring instrument.",
          items: [
            { text: "Circulating during pair work and noting who struggles with 'some/any'", bucket: "assessment" },
            { text: "A 20-question end-of-unit grammar quiz", bucket: "testing" },
            { text: "Deciding a student's term grade from all their work", bucket: "evaluation" },
            { text: "Thumbs up / thumbs down comprehension check mid-lesson", bucket: "assessment" },
            { text: "A timed dictation with a marking scheme", bucket: "testing" },
            { text: "Judging whether the class is ready to move to the next unit", bucket: "evaluation" },
            { text: "Exit tickets: one sentence using today's vocabulary", bucket: "assessment" },
            { text: "The regional standardized English exam", bucket: "testing" },
            { text: "Reviewing a portfolio to rate a trainee's overall progress", bucket: "evaluation" },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-assessment-master-outro" },
    ],
    rewards: {
      experience: 190,
      statChanges: [
        { stat: "englishKnowledge", amount: 7 },
        { stat: "teachingSkill", amount: 5 },
      ],
      itemIds: ["assessment-toolkit", "methodology-handbook"],
    },
    journal: {
      highScore:
        "Assessment is the thermometer during cooking. Testing is one instrument among many. Evaluation is the judgment at the end. Mr. Tahiri's green pen found almost nothing to correct today, and 'But what are you measuring?' has moved into my head permanently — rent-free, as Saadia says. I am now part of a thirty-year chain of teachers asking that question. Honored, honestly.",
      lowScore:
        "I confused the three words again today — assessment, evaluation, testing — and Mr. Tahiri's green pen had a field day. But the buckets are slowly separating in my mind: watching is assessment, judging is evaluation, the quiz itself is just a test. 'A test is a conversation, not an ambush,' he said. I intend to be a good conversationalist.",
    },
  },
  {
    id: "didactic-workshop",
    cityId: "bir-jdid",
    title: "Didactic Production Workshop",
    category: "professional-development",
    difficulty: 3,
    summary: "Team up with Khadija and Saadia to produce a full pack of teaching materials worth fighting over.",
    prerequisites: ["assessment-master"],
    story:
      "Three cohorts, one workshop hall, infinite laminate. Reunited with Khadija and Saadia, Selma must co-create a complete didactic pack — flashcards, a board game, worksheets with actual jokes — proving that the best teaching materials are built by teams who know each other's strengths.",
    objectives: [
      { id: "o1", description: "Plan the materials pack with the team" },
      { id: "o2", description: "Apply sound design principles to every item" },
      { id: "o3", description: "Finish before the laminator overheats" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-didactic-workshop-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "grammar-challenge",
          title: "Materials That Work",
          instructions:
            "The team debates each design decision. Choose the option that makes the material genuinely effective for learners.",
          questions: [
            {
              prompt: "For vocabulary flashcards aimed at 1st years, the picture side should show:",
              options: [
                "One clear image per word, no text on the picture side",
                "The image plus the word plus its translation plus an example sentence",
                "Decorative borders with a small image in the corner",
                "Abstract symbols to make students think harder",
              ],
              correctIndex: 0,
              explanation:
                "A flashcard tests retrieval. If the answer is printed next to the question, it becomes decoration, not practice.",
            },
            {
              prompt: "The grammar board game works best when a wrong answer means:",
              options: [
                "The player hears the correct form and gets a retry on their next turn",
                "The player is eliminated from the game",
                "Nothing — all answers are accepted to keep things positive",
                "The player moves backward five squares every time",
              ],
              correctIndex: 0,
              explanation:
                "Games teach through safe failure. Elimination removes exactly the learners who need the practice most.",
            },
            {
              prompt: "Khadija asks: how hard should the worksheet exercises be?",
              options: [
                "Start at what they can do, end one step beyond it — with support",
                "All exercises at exam difficulty, to prepare them early",
                "Very easy throughout, so everyone finishes happy",
                "Random difficulty, to keep students alert",
              ],
              correctIndex: 0,
              explanation:
                "The ramp from confidence to challenge — scaffolding — is what makes a worksheet teach rather than merely occupy.",
            },
            {
              prompt: "Saadia wants jokes in the worksheets. The pedagogically sound ruling:",
              options: [
                "Yes — humor in the example sentences themselves, so the laugh rewards the reading",
                "No — worksheets are serious documents",
                "Yes, but only in a joke section at the end, separate from the exercises",
                "Only jokes in Arabic, to relax students",
              ],
              correctIndex: 0,
              explanation:
                "If the funny sentence IS the grammar example, attention and memory work together. Saadia's instinct, formalized.",
            },
            {
              prompt: "Before laminating thirty copies, the team should:",
              options: [
                "Pilot the materials on one real exercise run-through and fix what stumbles",
                "Laminate immediately — the deadline is the priority",
                "Add more color to every page first",
                "Have the most senior trainee approve the aesthetics",
              ],
              correctIndex: 0,
              explanation:
                "One pilot catches the ambiguous instruction that thirty laminated copies would have preserved forever.",
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-didactic-workshop-outro" },
    ],
    rewards: {
      experience: 190,
      statChanges: [
        { stat: "teachingSkill", amount: 5 },
        { stat: "englishKnowledge", amount: 4 },
        { stat: "reputation", amount: 4 },
      ],
      itemIds: ["teaching-materials-pack"],
    },
    journal: {
      highScore:
        "The pack is finished: flashcards that actually test, a board game where wrong answers teach, worksheets with Saadia's jokes built into the grammar itself. The supervising teachers kept 'borrowing' our materials to photograph. Khadija laminated everything including, briefly, her own badge. Best workshop day of my life — teaching is a team sport played by people who pretend it's solo.",
      lowScore:
        "Workshop day: chaotic, glue-scented, ultimately victorious. Half our design decisions had to be redone — flashcards with the answers printed on the front, a board game that eliminated the strugglers first. But the redo is where I learned the principles for real. Saadia's verdict: 'We built it wrong, then we built it right, which means we REALLY built it.' She's not wrong. She's never wrong. Don't tell her.",
    },
  },
];
