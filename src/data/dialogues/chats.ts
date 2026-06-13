import type { DialogueTree } from "@/types";

/** Casual conversations available from each city's NPC panel. */
export const CHAT_DIALOGUES: DialogueTree[] = [
  {
    id: "chat-mr-alaoui",
    npcId: "mr-alaoui",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "mr-alaoui",
        mood: "happy",
        text: "Selma! Tea? The staffroom kettle is older than some of my students, but it still performs.",
        choices: [
          {
            id: "c1",
            text: "Tea, please — and a question: how do you stay patient after 22 years?",
            next: "n2",
            relationshipDelta: 4,
          },
          {
            id: "c2",
            text: "Just passing by — wanted to say thank you for everything.",
            next: "n3",
            relationshipDelta: 3,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "mr-alaoui",
        mood: "neutral",
        text: "Patience is not something you have, it is something you practice. Like the students, I am also doing exercises every day. Mine are just invisible.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "mr-alaoui",
        mood: "proud",
        text: "Thank me by becoming the teacher some nervous trainee observes in twenty years. That is how this profession says thank you.",
        next: null,
      },
    },
  },
  {
    id: "chat-dr-bennani",
    npcId: "dr-benhaddouche",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "dr-benhaddouche",
        mood: "neutral",
        text: "Miss Selma. I have four reports to annotate, so you have four minutes. Use them well.",
        choices: [
          {
            id: "c1",
            text: "What do you look for first in an observation sheet?",
            next: "n2",
            relationshipDelta: 4,
          },
          {
            id: "c2",
            text: "Is it true you read everything twice?",
            next: "n3",
            relationshipDelta: 3,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "dr-benhaddouche",
        mood: "neutral",
        text: "Evidence of looking at learners, not at the teacher. Weak trainees describe the show. Strong ones describe the learning. You have three minutes left — go practice.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "dr-benhaddouche",
        mood: "happy",
        text: "Twice, minimum. The first read tells me what you did. The second tells me who you are becoming. Both matter to me more than you suspect.",
        next: null,
      },
    },
  },
  {
    id: "chat-saadia",
    npcId: "saadia",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "saadia",
        mood: "happy",
        text: "Habibti! Sit, sit — I brought almond cookies and a story. Today a student wrote 'the weather is fine, thank you and you?' on his exam. I gave him half a point for politeness. Rate my joke before I tell the class: 'Why did the adjective break up with the adverb? Too much modification in the relationship.'",
        choices: [
          {
            id: "c1",
            text: "(Laughing) Three out of ten — the students will groan beautifully.",
            next: "n2",
            relationshipDelta: 5,
          },
          {
            id: "c2",
            text: "Save it for the inspector. I dare you.",
            next: "n3",
            relationshipDelta: 5,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "saadia",
        mood: "happy",
        text: "You LAUGHED, I saw it, no take-backs! Three out of ten is my best score yet. The groan is the point, habibti — a groaning class is a listening class. That's pedagogy. Probably. Have another cookie, you're too serious for a Tuesday.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "saadia",
        mood: "worried",
        text: "Inspector Tazi?! Habibti, I want to be a teacher, not a legend who perished telling grammar jokes. ...Although. 'Saadia: she came, she taught, she modified the relationship.' Write that on my staffroom mug when I'm famous.",
        next: null,
      },
    },
  },
  {
    id: "chat-mrs-fassi",
    npcId: "mrs-fassi",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "mrs-fassi",
        mood: "neutral",
        text: "Miss Selma. Walk with me — I inspect corridors while I talk. It saves time and frightens the right people.",
        choices: [
          {
            id: "c1",
            text: "How did you become a director?",
            next: "n2",
            relationshipDelta: 4,
          },
          {
            id: "c2",
            text: "Any advice for my time in your school?",
            next: "n3",
            relationshipDelta: 3,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "mrs-fassi",
        mood: "neutral",
        text: "Fifteen years of teaching, then someone had to defend this school's budget and nobody else would face the delegation. I faced them. Twice. Now they call ahead before visiting.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "mrs-fassi",
        mood: "happy",
        text: "Learn every student's name in your first week. Discipline problems shrink when children are seen. That advice is free — most of mine costs paperwork.",
        next: null,
      },
    },
  },
  {
    id: "chat-amine",
    npcId: "amine",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "amine",
        mood: "happy",
        text: "Miss! Miss! I learned a new word from a cartoon: 'magnificent'. I have used it nine times today. My mother says it is becoming a problem.",
        choices: [
          {
            id: "c1",
            text: "That is a magnificent problem to have, Amine.",
            next: "n2",
            relationshipDelta: 5,
          },
          {
            id: "c2",
            text: "Then tomorrow's mission: find a word even better than magnificent.",
            next: "n3",
            relationshipDelta: 4,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "amine",
        mood: "happy",
        text: "MISS. You used it. We are now a magnificent team. I will tell everyone English is my favorite subject. It was already, but now it is OFFICIAL.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "amine",
        mood: "neutral",
        text: "A better word... 'spectacular'? 'Extraordinary'? Miss, this mission is dangerous. I accept.",
        next: null,
      },
    },
  },
  {
    id: "chat-khadija",
    npcId: "khadija",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "khadija",
        mood: "neutral",
        text: "Selma, settle a debate between me and my binder: is it excessive to have a backup portfolio of the backup portfolio?",
        choices: [
          {
            id: "c1",
            text: "Yes. Gently, lovingly: yes.",
            next: "n2",
            relationshipDelta: 4,
          },
          {
            id: "c2",
            text: "Ask me again after we survive Dr. Benhaddouche's review.",
            next: "n3",
            relationshipDelta: 4,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "khadija",
        mood: "happy",
        text: "...The binder disagrees, but the binder also can't sleep at night, so maybe you have a point. River walk later? NO highlighters. Okay, one.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "khadija",
        mood: "worried",
        text: "A wise non-answer. This is why you'll pass the ethics seminar and I'll be in the corner laminating my anxiety. Team effort!",
        next: null,
      },
    },
  },
  {
    id: "chat-si-brahim",
    npcId: "si-brahim",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "si-brahim",
        mood: "neutral",
        text: "Ah, the polite one. The photocopier asked about you. By which I mean it jammed, and I thought of people who treat it kindly.",
        choices: [
          {
            id: "c1",
            text: "Tell me a story from the archives, Si Brahim.",
            next: "n2",
            relationshipDelta: 5,
          },
          {
            id: "c2",
            text: "Shall I look at the photocopier? I'm gentle with machines.",
            next: "n3",
            relationshipDelta: 4,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "si-brahim",
        mood: "happy",
        text: "1989. A trainee so nervous he laminated his own bus ticket instead of the flashcard. He is now a regional director. I keep the ticket in drawer three, as evidence that everyone begins somewhere.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "si-brahim",
        mood: "happy",
        text: "Gentle with machines, polite with archivists — you will go far. The secret is the left tray. Lift, never pull. Like teaching, no? Lift, never pull.",
        next: null,
      },
    },
  },
  {
    id: "chat-mr-tahiri",
    npcId: "mr-tahiri",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "mr-tahiri",
        mood: "neutral",
        text: "Selma. Quick exercise, since you're here: a student scores 19 out of 20 on your quiz. What do you actually know about that student?",
        choices: [
          {
            id: "c1",
            text: "Only what the quiz measured — which might be less than it looks.",
            next: "n2",
            relationshipDelta: 6,
          },
          {
            id: "c2",
            text: "That they studied hard?",
            next: "n3",
            relationshipDelta: 2,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "mr-tahiri",
        mood: "proud",
        text: "Exactly. Maybe it measured memory, not mastery. Maybe luck. A good assessor stays humble about numbers. You're learning faster than my green pen can keep up.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "mr-tahiri",
        mood: "neutral",
        text: "Maybe. Or they memorized without understanding, or the questions were too easy, or they sat near the window with the answers in the glass reflection — 2017, long story. Numbers need interrogation, Selma.",
        next: null,
      },
    },
  },
  {
    id: "chat-souad",
    npcId: "souad",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "souad",
        mood: "happy",
        text: "Selma! Sit, sit. I made msemen for the teachers' room. A school runs on three things: good teachers, good organization, and good msemen. I supply one and supervise the other two.",
        choices: [
          {
            id: "c1",
            text: "What do parents really want from teachers?",
            next: "n2",
            relationshipDelta: 5,
          },
          {
            id: "c2",
            text: "How do you do it all — three kids, the commute, the committee?",
            next: "n3",
            relationshipDelta: 4,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "souad",
        mood: "neutral",
        text: "Honesty. If my son struggles, tell me early and tell me kindly. Parents can forgive bad news. We do not forgive surprises in June.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "souad",
        mood: "happy",
        text: "Lists, my dear. And a husband who learned to cook in 2019, may that year be blessed. You will learn: capable people are made, not born. Usually by necessity.",
        next: null,
      },
    },
  },
  {
    id: "chat-inspector-tazi",
    npcId: "inspector-tazi",
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "inspector-tazi",
        mood: "neutral",
        text: "Miss Selma. Unusual — most trainees take the long corridor when they see me. You walked directly here.",
        choices: [
          {
            id: "c1",
            text: "The long corridor doesn't have answers. What makes a teacher 'outstanding' to you?",
            next: "n2",
            relationshipDelta: 6,
          },
          {
            id: "c2",
            text: "I figured the inspection is scarier if I've never spoken to you.",
            next: "n3",
            relationshipDelta: 5,
          },
        ],
      },
      n2: {
        id: "n2",
        speaker: "inspector-tazi",
        mood: "neutral",
        text: "Outstanding teachers make themselves progressively unnecessary. The class that runs on curiosity when the teacher steps out — that is the signature I look for. Few trainees ask. Fewer listen. You did both.",
        next: null,
      },
      n3: {
        id: "n3",
        speaker: "inspector-tazi",
        mood: "happy",
        text: "Strategically sound. An inspector you have spoken with is merely a man with a briefcase. Keep this composure for Casablanca, Miss Selma.",
        next: null,
      },
    },
  },
];
