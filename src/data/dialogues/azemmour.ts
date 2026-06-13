import type { DialogueTree } from "@/types";

export const AZEMMOUR_DIALOGUES: DialogueTree[] = [
  {
    id: "q-portfolio-intro",
    npcId: "khadija",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "narrator",
        text: "Azemmour, town of river light and street murals. In the trainee room, Khadija sits behind a fortress of binders, each tab a different color of determination.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "khadija",
        mood: "worried",
        text: "Selma! Thank goodness. Portfolio season. Internship reports are due and Dr. Benhaddouche reads EVERYTHING. Twice. I've drafted nine reflections and I hate eleven of them.",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "selma",
        mood: "neutral",
        text: "Nine drafts, eleven hated — Khadija, that math only works if you're too tired. When did you last sleep properly?",
        next: "n4",
      },
      n4: {
        id: "n4",
        speaker: "khadija",
        mood: "worried",
        text: "Sleep is for after certification. Look — the portfolio needs real reflection, not just 'the lesson went well'. What makes a reflection actually good?",
        choices: [
          {
            id: "c1",
            text: "Honesty about what failed, plus what you'd change next time.",
            next: "n5",
            effects: [{ stat: "confidence", amount: 2 }],
            relationshipDelta: 6,
            decisionFlag: "portfolio-honest-reflection",
          },
          {
            id: "c2",
            text: "Connecting classroom moments to the theory from CRMEF lectures.",
            next: "n5",
            effects: [{ stat: "englishKnowledge", amount: 2 }],
            relationshipDelta: 4,
            decisionFlag: "portfolio-theory-reflection",
          },
        ],
      },
      n5: {
        id: "n5",
        speaker: "khadija",
        mood: "happy",
        text: "Yes. YES. Okay — let's pick the strongest pieces together. You choose, I'll format. I have a highlighter for 'approved' and it has been lonely.",
        next: null,
      },
    },
  },
  {
    id: "q-portfolio-outro",
    npcId: "khadija",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "khadija",
        mood: "happy",
        text: "Submitted! Both portfolios. Selma, your reflection on the milk lesson — where you admitted the timing collapsed in production stage? Dr. Benhaddouche wrote 'finally, a trainee who watches herself teach' on it.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "selma",
        mood: "happy",
        text: "Praise from the old lion himself. Frame it. And Khadija — tonight, no binders. River walk, orange juice, zero highlighters.",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "khadija",
        mood: "happy",
        text: "...One highlighter. In case the sunset needs annotating. Deal?",
        next: null,
      },
    },
  },
  {
    id: "q-sheet-factory-intro",
    npcId: "si-brahim",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "narrator",
        text: "Thursday. A memo arrives: ALL observation sheets must be archived by end of day. Selma's stack is... not small. At the archive desk, Si Brahim surveys her pile like a customs officer.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "si-brahim",
        mood: "neutral",
        text: "Eleven sheets by five o'clock, young lady. I have seen trainees weep at this desk. I have also seen them triumph. The difference is usually tea and strategy.",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "selma",
        mood: "worried",
        text: "Eleven sheets, five hours, one me. Si Brahim, I'm going to need the good pens.",
        next: "n4",
      },
      n4: {
        id: "n4",
        speaker: "si-brahim",
        mood: "happy",
        text: "The good pens are for trainees who ask politely. You qualify. A word of forty years' experience: speed kills accuracy, and exhaustion kills both. Pace yourself.",
        next: null,
      },
    },
  },
  {
    id: "q-sheet-factory-outro",
    npcId: "si-brahim",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "si-brahim",
        mood: "proud",
        text: "Archived, stamped, and filed before the deadline. In forty years I have given the 'good pens' to maybe a dozen trainees. Fewer have returned them. You returned them. Remarkable.",
        next: "n2",
      },
      n2: {
        id: "n2",
        speaker: "selma",
        mood: "happy",
        text: "My hand may never uncurl from pen position again. But there's something deeply satisfying about a finished stack of paperwork. Is that what becoming a civil servant feels like?",
        next: "n3",
      },
      n3: {
        id: "n3",
        speaker: "si-brahim",
        mood: "happy",
        text: "That, and the tea afterwards. Which — as it happens — is ready. You have earned the archive room's hospitality, Miss Selma. That is not a small thing.",
        next: null,
      },
    },
  },
];
