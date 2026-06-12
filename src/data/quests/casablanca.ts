import type { QuestDefinition } from "@/types";

export const CASABLANCA_QUESTS: QuestDefinition[] = [
  {
    id: "grand-inspection",
    cityId: "casablanca",
    title: "The Grand Teaching Inspection",
    category: "assessment-task",
    difficulty: 5,
    summary: "Six sections. One inspector. Everything the journey taught you, on the line in the white city.",
    story:
      "Casablanca at last. In a quiet examination hall above the rumbling city, Inspector Tazi administers the Grand Teaching Inspection: lesson planning, grammar teaching, classroom management, assessment design, reflection, and self-evaluation. Every choice Selma made on the road from Safi is in the room with her.",
    objectives: [
      { id: "o1", description: "Complete all six sections of the inspection" },
      { id: "o2", description: "Apply everything from Safi, El Jadida, Azemmour, Bir Jdid and Had Soualem" },
      { id: "o3", description: "Become a certified English teacher" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-grand-inspection-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "final-inspection",
          title: "The Grand Teaching Inspection",
          instructions:
            "Six sections, answered one by one. Your journey's stats and decisions weigh on the final grade — this exam is the rest.",
          sections: [
            {
              name: "Lesson Planning",
              questions: [
                {
                  prompt: "The single most important element a lesson plan must define is:",
                  options: [
                    "What the learners will be able to DO by the end of the lesson",
                    "The exact words the teacher will say at each stage",
                    "Which textbook pages will be covered",
                    "The decoration and layout of the board",
                  ],
                  correctIndex: 0,
                  explanation: "Objectives stated as learner outcomes drive every other planning decision — the El Jadida lesson lived on this.",
                },
                {
                  prompt: "In a PPP lesson on polite requests, the production stage should be:",
                  options: [
                    "Learners improvising their own café scenes with minimal teacher control",
                    "Learners repeating model sentences in chorus",
                    "The teacher demonstrating a perfect dialogue",
                    "A gap-fill worksheet on some/any",
                  ],
                  correctIndex: 0,
                  explanation: "Production means learners using language freely; the controlled work belongs to the practice stage.",
                },
                {
                  prompt: "Your plan overruns and the production stage is at risk. The professional fix is to:",
                  options: [
                    "Cut a controlled practice activity to protect the production stage",
                    "Skip the wrap-up and finish mid-activity at the bell",
                    "Cancel production — it can happen next week",
                    "Speed through everything at double pace",
                  ],
                  correctIndex: 0,
                  explanation: "Free use of language is the lesson's destination. Trim the journey, never the arrival — Azemmour's portfolio lesson.",
                },
              ],
            },
            {
              name: "Grammar Teaching",
              questions: [
                {
                  prompt: "The most effective way to introduce comparative adjectives is:",
                  options: [
                    "A meaningful context the learners care about, from which the rule is drawn out",
                    "The rule on the board first, followed by twenty transformation drills",
                    "A grammar terminology lecture: morphemes, inflection, periphrasis",
                    "Assigning the textbook explanation as silent reading",
                  ],
                  correctIndex: 0,
                  explanation: "Context first, rules second — Mr. Alaoui's football teams taught more than the chart ever did.",
                },
                {
                  prompt: "A learner says 'Safi is more old than El Jadida.' The best response is:",
                  options: [
                    "'Great sentence to work with — who can help us upgrade one word?'",
                    "'No. Listen carefully: OLDER. Repeat it.'",
                    "Ignore the error to protect their confidence",
                    "Write the error on the board with their name for the class to correct",
                  ],
                  correctIndex: 0,
                  explanation: "Error treatment that protects dignity turns mistakes into the lesson's best material.",
                },
                {
                  prompt: "For quantity expressions, learners best internalize 'some/any' through:",
                  options: [
                    "Repeated meaningful use in situations like café orders and shopping lists",
                    "Memorizing the rule: 'some in affirmatives, any in negatives and questions'",
                    "A worksheet of fifty isolated sentences",
                    "A lecture on countability in English nouns",
                  ],
                  correctIndex: 0,
                  explanation: "Rules describe the destination; meaningful use is the road that gets learners there.",
                },
              ],
            },
            {
              name: "Classroom Management",
              questions: [
                {
                  prompt: "Two students whisper during your explanation. Your first move:",
                  options: [
                    "Keep teaching while moving calmly to stand near their table",
                    "Stop the lesson and demand to know what was said",
                    "Send both students out immediately",
                    "Raise your voice over the whispering",
                  ],
                  correctIndex: 0,
                  explanation: "Proximity control: the lesson never stops, and the behavior does — Safi's first observation, full circle.",
                },
                {
                  prompt: "The most reliable foundation for class discipline over a school year is:",
                  options: [
                    "Consistent routines and clear expectations from day one",
                    "Strict punishments applied to early offenders as examples",
                    "Being liked by the students",
                    "A seating chart separating all friendships",
                  ],
                  correctIndex: 0,
                  explanation: "Routines make order the default rather than a daily battle. Discipline is architecture, not enforcement.",
                },
                {
                  prompt: "Mid-activity, the noise rises beyond useful. The skilled response:",
                  options: [
                    "Use the established attention signal and wait the full three seconds",
                    "Shout once, loudly, to reset the room",
                    "Turn the lights off and on until silence",
                    "End the activity as a punishment",
                  ],
                  correctIndex: 0,
                  explanation: "A rehearsed signal plus genuine wait time — the routine does the work the voice would have strained at.",
                },
              ],
            },
            {
              name: "Assessment Design",
              questions: [
                {
                  prompt: "Checking comprehension with thumbs up/down during the lesson is an example of:",
                  options: [
                    "Formative assessment",
                    "Summative evaluation",
                    "Standardized testing",
                    "Self-evaluation",
                  ],
                  correctIndex: 0,
                  explanation: "The thermometer during cooking — gathering evidence while learning is still happening. Bir Jdid's first bucket.",
                },
                {
                  prompt: "Before writing any quiz question, the designer must first ask:",
                  options: [
                    "'What exactly am I measuring?'",
                    "'How many questions make it look serious?'",
                    "'Which questions will produce a nice grade curve?'",
                    "'What did the last teacher's quiz look like?'",
                  ],
                  correctIndex: 0,
                  explanation: "Mr. Tahiri's question — the one that echoes for thirty years. Validity starts before item one.",
                },
                {
                  prompt: "A fair test is best described as:",
                  options: [
                    "A conversation with the learner about what was taught — never an ambush",
                    "An instrument that ranks students efficiently",
                    "A challenge containing surprises to identify true ability",
                    "Identical in difficulty to the regional exam at all times",
                  ],
                  correctIndex: 0,
                  explanation: "Tests measure teaching as much as learning. Fairness is a form of respect for students.",
                },
              ],
            },
            {
              name: "Reflection",
              questions: [
                {
                  prompt: "The mark of genuine reflective practice in a portfolio is:",
                  options: [
                    "Honest analysis of what failed, with a concrete change for next time",
                    "Consistently positive summaries of every lesson",
                    "Accurate lists of the techniques used",
                    "Quotations from methodology textbooks",
                  ],
                  correctIndex: 0,
                  explanation: "'Finally, a trainee who watches herself teach.' Reflection is evidence of attention, not performance of positivity.",
                },
                {
                  prompt: "After a lesson goes badly, the professionally productive question is:",
                  options: [
                    "'What exactly stumbled, and what will I change on Thursday?'",
                    "'Which students caused this?'",
                    "'How do I make sure no one observes that class again?'",
                    "'Was the class simply too weak for this material?'",
                  ],
                  correctIndex: 0,
                  explanation: "Specific, owned, forward-looking — the Azemmour formula. Blame is reflection's counterfeit.",
                },
                {
                  prompt: "A teacher observes a colleague's lesson. The strongest observation notes describe:",
                  options: [
                    "What the learners did and what it revealed about the teaching",
                    "The teacher's style, charisma and stage presence",
                    "Everything, in strict chronological order",
                    "Only the problems, for maximum usefulness",
                  ],
                  correctIndex: 0,
                  explanation: "Weak observers describe the show; strong ones describe the learning. Dr. Benhadouch's first read and second.",
                },
              ],
            },
            {
              name: "Self-Evaluation",
              questions: [
                {
                  prompt: "Inspector Tazi asks: 'What would you change if you taught today's lesson again?' The answer that earns full marks:",
                  options: [
                    "One specific weakness, named without fear, with exactly how you'd fix it",
                    "'Honestly, it went according to plan.'",
                    "A long, complete list of everything imperfect",
                    "'I would let the students decide what to change.'",
                  ],
                  correctIndex: 0,
                  explanation: "Self-aware, specific, unafraid — the micro-teaching answer, now second nature.",
                },
                {
                  prompt: "The healthiest stance toward your own teaching ability is:",
                  options: [
                    "It is a practice that improves through deliberate attention, not a fixed talent",
                    "Some people are born teachers; the rest manage",
                    "After certification, the learning is essentially complete",
                    "Self-doubt should be eliminated entirely before entering a classroom",
                  ],
                  correctIndex: 0,
                  explanation: "Patience is practiced, confidence is built, teachers are made — the whole road from Safi says so.",
                },
                {
                  prompt: "An outstanding teacher, in the end, is one who:",
                  options: [
                    "Makes themselves progressively unnecessary as learners' curiosity takes over",
                    "Delivers flawless lessons that depend on their presence",
                    "Is never challenged by students or parents",
                    "Covers the full textbook before June, every year",
                  ],
                  correctIndex: 0,
                  explanation: "The class that runs on curiosity when the teacher steps out — the signature Inspector Tazi looks for.",
                },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-grand-inspection-outro" },
    ],
    rewards: {
      experience: 880,
      statChanges: [
        { stat: "confidence", amount: 10 },
        { stat: "reputation", amount: 10 },
      ],
      itemIds: ["teaching-certificate"],
    },
    journal: {
      highScore:
        "I write this from a café in Casablanca, where the wind is exactly as strong as Amine's uncle's hat always claimed. The inspection is over. Six sections, and inside every answer was a person: Mr. Alaoui's choreography, Mrs. Fassi's window, Si Brahim's pens, Mr. Tahiri's question, Souad's msemen, Saadia's laugh, the girl who whispered 'painting'. I walked in as a trainee. I walked out as a teacher. The journey made the answers true.",
      lowScore:
        "I write this from a café in Casablanca, hands still unsteady. The inspection found my gaps — sections where the knowledge wobbled under pressure. But Inspector Tazi said something I believe: results mean little next to the next thirty years of Monday mornings. Whatever the certificate says, the road from Safi built someone who knows exactly what to strengthen. That, too, is an outcome.",
    },
  },
];
