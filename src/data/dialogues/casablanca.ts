import type { DialogueTree } from "@/types";

export const CASABLANCA_DIALOGUES: DialogueTree[] = [
  {
    id: "q-grand-inspection-intro",
    npcId: "inspector-tazi",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "narrator",
        text: "Casablanca. The city Selma has imagined since her first day in Safi. The examination hall is quiet except for the hum of the city outside — and the sound of her own heartbeat.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "inspector-tazi",
        mood: "neutral",
        text: "Miss Selma. Six sections: lesson planning, grammar teaching, classroom management, assessment design, reflection, and self-evaluation. Everything you have done on this journey is in this room with you.",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "selma",
        mood: "worried",
        text: "From Safi to here. Observation sheets, the milk lesson, the portfolio, the pigeon at Open Day... if it all counts, Inspector, then I'm ready.",
        next: "n4",
      },
      n4: {
        id: "n4",
        speaker: "inspector-tazi",
        mood: "neutral",
        text: "One last thing before we begin. Why do you want to teach, Miss Selma? Not the application-form answer. The real one.",
        choices: [
          {
            id: "c1",
            text: "Because of the girl in the back row who whispered 'painting' to herself, twice, smiling.",
            next: "n5",
            effects: [{ stat: "confidence", amount: 3 }],
            relationshipDelta: 10,
            decisionFlag: "inspection-answer-students",
          },
          {
            id: "c2",
            text: "Because every teacher I admired changed my life — and someone has to keep the chain going.",
            next: "n5",
            effects: [{ stat: "reputation", amount: 3 }],
            relationshipDelta: 10,
            decisionFlag: "inspection-answer-chain",
          },
        ],
      },
      n5: {
        id: "n5",
        speaker: "inspector-tazi",
        mood: "proud",
        text: "...That is the correct answer. Both of them, always. Take your seat, Miss Selma. The Grand Teaching Inspection begins now.",
        next: null,
      },
    },
  },
  {
    id: "q-grand-inspection-outro",
    npcId: "inspector-tazi",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "narrator",
        text: "The final page is turned. Inspector Tazi reads, annotates, and reads again. Outside, Casablanca rumbles on, unaware that one of its future teachers is holding her breath.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "inspector-tazi",
        mood: "neutral",
        text: "I have inspected one thousand four hundred and twelve teachers. I remember the ones who put learners first. Your results are being prepared, Miss Selma.",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "selma",
        mood: "worried",
        text: "From a nervous trainee in Safi to this chair in Casablanca. Whatever the result — thank you, Inspector. For making it mean something.",
        next: "n4",
      },
      n4: {
        id: "n4",
        speaker: "inspector-tazi",
        mood: "proud",
        text: "Results mean little, Miss Selma. What you do every Monday morning for the next thirty years — that means everything. Now: let us see how you did.",
        next: null,
      },
    },
  },
];
