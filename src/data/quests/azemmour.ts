import type { QuestDefinition } from "@/types";

export const AZEMMOUR_QUESTS: QuestDefinition[] = [
  {
    id: "portfolio-challenge",
    cityId: "azemmour",
    title: "The Portfolio Challenge",
    category: "portfolio-task",
    difficulty: 3,
    summary: "Write the internship reports — and choose reflections worthy of Dr. Benhadouch's double reading.",
    story:
      "Portfolio season descends on Azemmour like river fog. With Khadija drowning in drafts beside her, Selma must assemble her internship report: not what happened, but what it meant. Dr. Benhadouch reads everything twice. The portfolio must survive both readings.",
    objectives: [
      { id: "o1", description: "Draft reflections on the internship so far" },
      { id: "o2", description: "Select the strongest observations for the portfolio" },
      { id: "o3", description: "Submit before Khadija laminates anything else" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-portfolio-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "portfolio-writing",
          title: "The Double Reading",
          instructions:
            "For each portfolio section, choose the reflection that shows real professional growth — not just polished surface.",
          prompts: [
            {
              topic: "Reflecting on the comparative adjectives observation in Safi",
              options: [
                {
                  text: "I recorded the strategies I saw and, more importantly, what each one did to the learners' attention. I now watch students to evaluate teaching, not the teacher.",
                  quality: 2,
                  feedback: "Learner-focused evidence — the exact thing Dr. Benhadouch reads for.",
                },
                {
                  text: "The lesson was excellent and very well managed. I learned a lot from this valuable experience.",
                  quality: 0,
                  feedback: "Polished, empty, and identical to two hundred other portfolios. The red pen knows.",
                },
                {
                  text: "Mr. Alaoui used proximity control, attention signals and positive error treatment, which are important classroom management techniques.",
                  quality: 1,
                  feedback: "Accurate listing — but a list is not yet a reflection. What changed in YOU?",
                },
              ],
            },
            {
              topic: "Reflecting on the quantities lesson in El Jadida",
              options: [
                {
                  text: "My timing collapsed in the production stage: I gave eight minutes to a task needing fifteen. Next time I will cut one practice activity rather than starve the production. Lesson plans are budgets, and I overspent early.",
                  quality: 2,
                  feedback: "An honest failure, analyzed, with a concrete fix. This is the entry that gets 'finally, a trainee who watches herself teach.'",
                },
                {
                  text: "The lesson went well overall and the students enjoyed the café roleplay very much.",
                  quality: 0,
                  feedback: "'Went well' is the phrase reflection goes to die in.",
                },
                {
                  text: "According to the PPP model, production should receive adequate time allocation, which I will consider in future lessons.",
                  quality: 1,
                  feedback: "Theory cited, self barely present. Connect the model to YOUR minutes.",
                },
              ],
            },
            {
              topic: "Reflecting on professional growth since arriving in Safi",
              options: [
                {
                  text: "In September I prepared lessons to protect myself from the class. Now I prepare them to reach the class. The difference is small on paper and enormous in the room.",
                  quality: 2,
                  feedback: "Growth captured in one honest contrast. Frame-worthy.",
                },
                {
                  text: "I have grown a lot professionally and personally during this enriching journey.",
                  quality: 0,
                  feedback: "A sentence that could be photocopied into anyone's portfolio proves nothing about yours.",
                },
                {
                  text: "My confidence has increased, my planning has improved, and my classroom management is developing steadily.",
                  quality: 1,
                  feedback: "True, but each claim needs one concrete moment as evidence.",
                },
              ],
            },
            {
              topic: "Choosing the portfolio's closing statement",
              options: [
                {
                  text: "This portfolio holds my mistakes on purpose. They are the most accurate record of where the learning happened — and the best predictor of the teacher I am becoming.",
                  quality: 2,
                  feedback: "Bold, true, and unforgettable after two readings.",
                },
                {
                  text: "Thank you for reading my portfolio. I hope it meets the requirements.",
                  quality: 0,
                  feedback: "It ends the document the way a shrug ends a conversation.",
                },
                {
                  text: "I am committed to continuing my professional development throughout my career.",
                  quality: 1,
                  feedback: "A fine sentiment that every portfolio since 1998 has ended with.",
                },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-portfolio-outro" },
    ],
    rewards: {
      experience: 170,
      statChanges: [
        { stat: "confidence", amount: 6 },
        { stat: "teachingSkill", amount: 4 },
      ],
      itemIds: ["portfolio-entry-internship"],
    },
    journal: {
      highScore:
        "Portfolio submitted. I wrote about my failures on purpose — the collapsed timing, the early panic — and Dr. Benhadouch wrote 'finally, a trainee who watches herself teach' in the margin. Khadija and I celebrated by the river with orange juice and exactly one highlighter. Honesty, it turns out, is a genre.",
      lowScore:
        "Portfolio submitted, barely. Too many of my reflections came back with the red pen's favorite word: 'evidence?' I wrote what sounded professional instead of what was true. Khadija — buried in her own binders — said something wise: 'The portfolio isn't about the internship. It's about whether you were paying attention to yourself.' Next entry, I will be.",
    },
  },
  {
    id: "sheet-factory",
    cityId: "azemmour",
    title: "Observation Sheet Factory",
    category: "internship-activity",
    difficulty: 3,
    summary: "Eleven observation sheets, one afternoon, finite energy. Si Brahim is watching. So is the clock.",
    prerequisites: ["portfolio-challenge"],
    story:
      "A memo arrives with the force of prophecy: ALL observation sheets archived by five o'clock. Selma faces the great trainee rite of passage — the paperwork sprint — armed with the good pens, Si Brahim's tea, and the dangerous belief that she can do eleven sheets without pacing herself.",
    objectives: [
      { id: "o1", description: "Complete the observation sheets before the deadline" },
      { id: "o2", description: "Manage your energy — exhaustion ruins accuracy" },
      { id: "o3", description: "Return the good pens (this matters more than you know)" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-sheet-factory-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "time-management",
          title: "The Five O'Clock Deadline",
          instructions:
            "Complete observation sheets before time runs out. Working drains energy; resting restores it but costs precious seconds. Tired hands fill sheets slowly — find the rhythm.",
          sheetTarget: 11,
          timeLimit: 60,
        },
      },
      { kind: "dialogue", dialogueId: "q-sheet-factory-outro" },
    ],
    rewards: {
      experience: 170,
      statChanges: [
        { stat: "energy", amount: 6 },
        { stat: "classroomManagement", amount: 3 },
      ],
      itemIds: ["time-management-badge"],
    },
    journal: {
      highScore:
        "Eleven sheets. Archived, stamped, filed, and the good pens returned with ceremony. Si Brahim made me tea from the archive room's secret stash, which Khadija informs me is roughly equivalent to a knighthood. Today I learned the deepest professional secret of all: pace beats panic. Every time.",
      lowScore:
        "The sheets got done — most of them on time, some of them legible. I sprinted when I should have paced and hit the wall at sheet seven, exactly as Si Brahim predicted with his forty years of watching trainees combust at that desk. He still gave me tea afterwards. 'Speed kills accuracy,' he said, 'and exhaustion kills both.' Framing that one too.",
    },
  },
];
