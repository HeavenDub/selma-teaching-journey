import type { QuestDefinition } from "@/types";

export const SAFI_QUESTS: QuestDefinition[] = [
  {
    id: "first-observation",
    cityId: "safi",
    title: "The First Observation",
    category: "teaching-practice",
    difficulty: 1,
    summary: "Observe Mr. Alaoui's lesson on comparative adjectives and spot the management craft behind it.",
    story:
      "Every teacher's story begins in the back row of someone else's classroom. Armed with a forty-field observation sheet and a racing heart, Selma watches her mentor teach comparative adjectives — and learns that classroom management is choreography you only see when you look for it.",
    objectives: [
      { id: "o1", description: "Attend Mr. Alaoui's comparative adjectives lesson" },
      { id: "o2", description: "Identify the effective classroom management strategies" },
      { id: "o3", description: "Complete your first observation sheet" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-first-observation-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "behavior-management",
          title: "Spot the Strategy",
          instructions:
            "Watch each classroom moment from Mr. Alaoui's lesson and identify which management strategy is at work.",
          scenarios: [
            {
              situation:
                "Before giving instructions, Mr. Alaoui stands still, raises one hand, and silently counts down from three with his fingers. The room settles.",
              options: [
                { text: "A silent attention signal — students respond to the routine, not to shouting.", quality: 2, feedback: "Exactly. A rehearsed signal saves the teacher's voice and the lesson's pace." },
                { text: "He forgot what he was going to say.", quality: 0, feedback: "He very much remembered — the pause IS the technique." },
                { text: "He's checking if anyone misbehaves to punish them.", quality: 1, feedback: "It's about resetting attention, not catching culprits." },
              ],
            },
            {
              situation:
                "Two boys at the back start whispering during pair work. Mr. Alaoui continues teaching but slowly walks over and stands near their table.",
              options: [
                { text: "Proximity control — presence corrects behavior without stopping the lesson.", quality: 2, feedback: "Right. Not a word spoken, not a second of lesson lost." },
                { text: "He should have sent them out immediately.", quality: 0, feedback: "Escalating a whisper to an exclusion would cost far more than it fixes." },
                { text: "He wanted to hear their conversation.", quality: 1, feedback: "Close — he wants them to KNOW he can hear. The effect is what matters." },
              ],
            },
            {
              situation:
                "When transitioning from board work to pair work, he announces: 'You have exactly four minutes. I will know you're done when both partners have written two sentences.'",
              options: [
                { text: "Clear time limits with a visible success criterion for the task.", quality: 2, feedback: "Yes — students know how long, and exactly what 'finished' looks like." },
                { text: "Being strict so students fear the deadline.", quality: 1, feedback: "It's clarity, not fear, doing the work here." },
                { text: "Filling time because the lesson plan ran short.", quality: 0, feedback: "This is the lesson plan, working exactly as designed." },
              ],
            },
            {
              situation:
                "A girl gives a wrong answer: 'Safi is more old than El Jadida.' Mr. Alaoui says: 'Great sentence to work with! Who can help us upgrade one word?'",
              options: [
                { text: "Error treatment that protects dignity and turns mistakes into material.", quality: 2, feedback: "Perfect. The class learns the rule, and the girl keeps her courage to speak." },
                { text: "He should have given the correct answer immediately to save time.", quality: 1, feedback: "Faster, yes — but the self-correction moment is where learning sticks." },
                { text: "Ignoring errors so students feel good.", quality: 0, feedback: "The error was addressed — warmly and thoroughly." },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-first-observation-outro" },
    ],
    rewards: {
      experience: 110,
      statChanges: [
        { stat: "classroomManagement", amount: 6 },
        { stat: "teachingSkill", amount: 4 },
      ],
      itemIds: ["observation-sheet-1"],
    },
    journal: {
      highScore:
        "First day done. I caught almost every strategy Mr. Alaoui used — the countdown, the quiet walk to the noisy table, the way a wrong answer became the best minute of the lesson. Management isn't shouting. It's choreography. I want to learn the whole dance.",
      lowScore:
        "First day done. I'll be honest with this journal because no one else reads it: I missed half of what Mr. Alaoui was doing until he explained it after. Management is invisible when it works — which is beautiful, and also deeply unfair to observers. Tomorrow I watch harder.",
    },
  },
  {
    id: "after-school-activities",
    cityId: "safi",
    title: "After-School Activities",
    category: "english-challenge",
    difficulty: 1,
    summary: "Teach the 1st years vocabulary for after-school activities with a picture matching game.",
    prerequisites: ["first-observation"],
    story:
      "Selma's first time at the front of a real classroom. The mission: after-school activities vocabulary — painting, chess, football, swimming — taught to thirty 1st-years with picture cards and exactly one backup plan per disaster.",
    objectives: [
      { id: "o1", description: "Prepare picture cards for activity vocabulary" },
      { id: "o2", description: "Run the matching game with the class" },
      { id: "o3", description: "Get every student to say one activity in English" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-after-school-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "vocabulary-matching",
          title: "Activity Match",
          instructions:
            "Match each after-school activity word to its picture before the class gets restless. Fewer wrong attempts means a better score!",
          pairs: [
            { word: "painting", emoji: "🎨" },
            { word: "chess", emoji: "♟️" },
            { word: "football", emoji: "⚽" },
            { word: "swimming", emoji: "🏊" },
            { word: "reading", emoji: "📖" },
            { word: "gardening", emoji: "🪴" },
            { word: "cycling", emoji: "🚲" },
            { word: "singing", emoji: "🎤" },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-after-school-outro" },
    ],
    rewards: {
      experience: 120,
      statChanges: [
        { stat: "teachingSkill", amount: 6 },
        { stat: "englishKnowledge", amount: 4 },
        { stat: "confidence", amount: 3 },
      ],
    },
    journal: {
      highScore:
        "I taught today. Actually taught! The matching game worked better than I dreamed — hands up everywhere, and a girl in the back whispering 'painting' to herself like a secret. My hands shook for five minutes. Then they forgot to. I will remember that girl on my hardest days.",
      lowScore:
        "I taught today — sort of. The matching game got chaotic and I lost the thread more than once. But here is the thing this journal must remember: they still learned words. Even my clumsy lesson made something happen. Imagine what a good one will do.",
    },
  },
  {
    id: "micro-teaching",
    cityId: "safi",
    title: "Micro-Teaching Anxiety",
    category: "crmef-activity",
    difficulty: 2,
    summary: "Survive — no, master — ten minutes of teaching in front of your peers and Dr. Benhaddouche.",
    prerequisites: ["after-school-activities"],
    story:
      "The gauntlet. Ten minutes, a lesson of her own design, her fellow trainees as students, and Dr. Benhaddouche at the back with the famous notes. Every trainee fears micro-teaching; the wise ones prepare for it choice by choice.",
    objectives: [
      { id: "o1", description: "Prepare a ten-minute micro-lesson" },
      { id: "o2", description: "Choose effective teaching methods under pressure" },
      { id: "o3", description: "Finish with your confidence intact (or improved)" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-micro-teaching-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "micro-teaching",
          title: "The Ten Minutes",
          instructions:
            "Guide Selma through her micro-lesson moment by moment. Strong choices build composure; weak ones feed the nerves.",
          rounds: [
            {
              moment: "Minute 0. Twelve peers and one supervisor look up. Your opening move:",
              options: [
                { text: "Deliver the rehearsed opening line, then smile and scan the whole room.", quality: 2, feedback: "The prepared first sentence carries you to the second — exactly as planned." },
                { text: "Apologize in advance: 'Sorry, I'm really nervous.'", quality: 0, feedback: "The room was on your side until you told them not to be." },
                { text: "Start writing the lesson title on the board to buy a moment.", quality: 1, feedback: "A serviceable shield — but your back is to the room for ten long seconds." },
              ],
            },
            {
              moment: "Minute 2. You planned an elicitation question but the 'students' just stare. Silence stretches.",
              options: [
                { text: "Rephrase the question and give a concrete example to anchor it.", quality: 2, feedback: "Silence usually means the question was foggy, not the students. Rephrasing fixes the right problem." },
                { text: "Answer it yourself and move on quickly.", quality: 1, feedback: "The lesson moves — but you taught them that waiting you out works." },
                { text: "Repeat the same question, louder.", quality: 0, feedback: "Volume is not clarity. The fog remains, now at higher decibels." },
              ],
            },
            {
              moment: "Minute 5. Saadia, playing a difficult student, loudly asks: 'Teacher, why do we even need English?'",
              options: [
                { text: "Take it seriously for twenty seconds — connect English to her own stated dreams — then return to the lesson.", quality: 2, feedback: "You honored the question without surrendering the lesson. Dr. Benhaddouche's pen moves approvingly." },
                { text: "Say 'good question!' and ignore it.", quality: 1, feedback: "Half a response. The class noticed the dodge." },
                { text: "Tell her that's not relevant right now.", quality: 0, feedback: "Technically true, pedagogically expensive. The room cools." },
              ],
            },
            {
              moment: "Minute 8. You realize you have too much material left. Two minutes remain.",
              options: [
                { text: "Cut to the closing activity and end with a clear summary of the objective.", quality: 2, feedback: "A lesson that lands its ending feels complete at any length. Strong instinct." },
                { text: "Speed up and try to cover everything.", quality: 0, feedback: "The last two minutes became a blur nobody learned from." },
                { text: "Stop early and ask if there are questions.", quality: 1, feedback: "Honest, but a planned ending would have shown more control." },
              ],
            },
            {
              moment: "Minute 10. Done. Dr. Benhaddouche asks, in front of everyone: 'What would you change if you taught it again?'",
              options: [
                { text: "Name one specific weakness and exactly how you'd fix it.", quality: 2, feedback: "Self-aware, specific, unafraid. This is the answer she gives full marks to." },
                { text: "Say it went mostly as planned.", quality: 0, feedback: "Every lesson has a flaw. Claiming otherwise says you didn't look." },
                { text: "List everything that went wrong, at length.", quality: 1, feedback: "Reflection, yes — but drowning in self-criticism is its own blind spot." },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-micro-teaching-outro" },
    ],
    rewards: {
      experience: 140,
      statChanges: [
        { stat: "confidence", amount: 10 },
        { stat: "teachingSkill", amount: 5 },
      ],
    },
    journal: {
      highScore:
        "Micro-teaching is done and I am still alive — more alive than before, somehow. Around minute six I forgot to be terrified. Dr. Benhaddouche said it was 'teaching, not surviving.' Saadia cheered so loudly the eyebrow came out. Safi gave me my legs. Time to walk north.",
      lowScore:
        "Micro-teaching is done. It was rough in places — silences, a rushed ending, my heart in my ears throughout. But Dr. Benhaddouche told me something I'm writing down so I never lose it: he expects intention, not perfection. Next time, every minute will be chosen. Safi taught me to stand. El Jadida will teach me to walk.",
    },
  },
];
