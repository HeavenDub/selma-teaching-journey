import type { QuestDefinition } from "@/types";

export const HAD_SOUALEM_QUESTS: QuestDefinition[] = [
  {
    id: "school-life",
    cityId: "had-soualem",
    title: "School Life",
    category: "school-life",
    difficulty: 4,
    summary: "Run the school Open Day — assembly, exhibition, parents, pigeon. Keep everything (and everyone) aloft.",
    story:
      "Teaching is the classroom; school life is everything around it. Handed the master checklist for Had Soualem's Open Day, Selma must balance student engagement against orderly chaos while Souad and the parents' committee watch with professional interest.",
    objectives: [
      { id: "o1", description: "Manage the Open Day from assembly to closing chorus" },
      { id: "o2", description: "Keep both engagement and order alive all day" },
      { id: "o3", description: "Make sure the shy students get their moment" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-school-life-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "classroom-simulation",
          title: "Open Day",
          instructions:
            "Steer the Open Day event by event. Every decision moves two meters: Engagement and Order. Keep both healthy to the final chorus.",
          events: [
            {
              description: "8:00 — Morning assembly. The microphone squeals; three hundred students giggle and ripple.",
              options: [
                { text: "Laugh with them once, then start with the student choir instead of speeches.", engagementDelta: 15, orderDelta: 5, feedback: "The laugh releases the pressure; the choir channels it. Assembly saved." },
                { text: "Demand immediate silence before anything continues.", engagementDelta: -10, orderDelta: 10, feedback: "Quiet, yes — but the day starts with a frown it didn't need." },
                { text: "Pretend nothing happened and continue with the planned speech.", engagementDelta: -5, orderDelta: -5, feedback: "The giggles outlast the speech. Nobody hears the welcome." },
              ],
            },
            {
              description: "9:30 — English exhibition. A crowd forms at the comics table; the poetry corner stands empty, and so does the face of the girl who made it.",
              options: [
                { text: "Bring visiting parents to the poetry corner and ask the girl to read her favorite piece aloud.", engagementDelta: 15, orderDelta: 0, feedback: "Her first public English sentence — and nine relatives' worth of applause later, the corner has a queue." },
                { text: "Move the poetry display next to the comics for shared traffic.", engagementDelta: 5, orderDelta: 5, feedback: "Practical — though the girl deserved a spotlight, not a merger." },
                { text: "Let the crowd decide; popularity is its own judge.", engagementDelta: -10, orderDelta: 0, feedback: "The shy ones learn exactly the wrong lesson about whose work matters." },
              ],
            },
            {
              description: "11:00 — The projector dies mid-presentation. Forty parents wait. A technician is 'maybe twenty minutes' away.",
              options: [
                { text: "Switch to the students themselves: live Q&A with the English club while a teacher hunts cables.", engagementDelta: 15, orderDelta: 5, feedback: "The students outperform the slideshow. Several parents tear up. The projector is no longer missed." },
                { text: "Wait for the technician while apologizing repeatedly.", engagementDelta: -15, orderDelta: 0, feedback: "Twenty minutes of murmuring parents. The schedule never recovers." },
                { text: "Cancel the presentation segment entirely.", engagementDelta: -5, orderDelta: 10, feedback: "Tidy, but the English club rehearsed for two weeks. Hearts sink quietly." },
              ],
            },
            {
              description: "12:30 — Two parents argue loudly about parking, in the corridor, within earshot of the exhibition.",
              options: [
                { text: "Guide them to the office with coffee and a parent-committee mediator (Souad materializes instantly).", engagementDelta: 5, orderDelta: 15, feedback: "Souad resolves it in four minutes. The corridor never knew. This is what committees are for." },
                { text: "Intervene yourself and adjudicate the parking dispute.", engagementDelta: 0, orderDelta: 5, feedback: "Resolved — but the Open Day ran itself without its coordinator for fifteen minutes." },
                { text: "Ignore it; parking is not a school matter.", engagementDelta: -5, orderDelta: -15, feedback: "The argument grows an audience of delighted students. It IS a school matter now." },
              ],
            },
            {
              description: "14:00 — A pigeon enters the gymnasium during the parents' Q&A and begins a low reconnaissance flight.",
              options: [
                { text: "Name it the school mascot, open the far doors, and continue the Q&A with dignity.", engagementDelta: 10, orderDelta: 10, feedback: "The pigeon exits to applause. The Q&A resumes. Legend status: achieved." },
                { text: "Pause everything for a full pigeon-removal operation.", engagementDelta: 0, orderDelta: -10, feedback: "Six adults, two brooms, one unbothered pigeon. The Q&A never quite restarts." },
                { text: "Evacuate the gymnasium calmly.", engagementDelta: -15, orderDelta: 0, feedback: "An over-evacuation for one pigeon. The students rate the decision harshly and forever." },
              ],
            },
            {
              description: "16:00 — Closing chorus. The students are tired, the parents are emotional, and the music teacher mouths: 'one verse or three?'",
              options: [
                { text: "One verse, full heart — end on the peak.", engagementDelta: 15, orderDelta: 10, feedback: "Slightly off-key and entirely wonderful. Parents film everything. The day lands perfectly." },
                { text: "Three verses — give them the full program.", engagementDelta: -5, orderDelta: -5, feedback: "Verse two wobbles; verse three dissolves into yawning. Always end on the peak." },
                { text: "Skip the chorus; everyone is clearly exhausted.", engagementDelta: -10, orderDelta: 5, feedback: "The day ends with an announcement instead of a song. Something unfinished hangs in the air." },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-school-life-outro" },
    ],
    rewards: {
      experience: 210,
      statChanges: [
        { stat: "classroomManagement", amount: 7 },
        { stat: "reputation", amount: 6 },
        { stat: "energy", amount: 3 },
      ],
      itemIds: ["leadership-ribbon"],
    },
    journal: {
      highScore:
        "Open Day. The projector died, two parents declared parking war, and a pigeon conducted aerial operations over the Q&A — and none of it mattered, because the students never saw me flinch. The shy girl from the poetry corner spoke her first public English sentence to a hallway full of strangers. Souad says I 'handled it like a committee mother,' which I now know is the highest rank that exists.",
      lowScore:
        "Open Day happened TO me a little more than I happened to it. The projector crisis ate the schedule, and I adjudicated a parking dispute personally while the actual event ran itself. But the closing chorus still landed, the shy students still shone, and Souad's debrief was generous: 'Leadership is a muscle. Today was the gym.' Sore, but stronger.",
    },
  },
  {
    id: "professional-ethics",
    cityId: "had-soualem",
    title: "Professional Ethics",
    category: "ethics-challenge",
    difficulty: 5,
    summary: "Face Inspector Tazi's seminar of dilemmas with no comfortable answers — choose anyway.",
    prerequisites: ["school-life"],
    story:
      "The final gate before Casablanca. Inspector Tazi's ethics seminar offers no easy cases: fairness versus friendship, honesty versus comfort, rules versus mercy. Pedagogy can be taught in a year; judgment starts today.",
    objectives: [
      { id: "o1", description: "Work through the inspector's ethical dilemmas" },
      { id: "o2", description: "Put learners first, even when it costs you" },
      { id: "o3", description: "Earn Inspector Tazi's respect before the Grand Inspection" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-ethics-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "behavior-management",
          title: "The Dilemma Seminar",
          instructions:
            "Inspector Tazi presents real cases from real schools. There are no comfortable answers — choose the principled one.",
          scenarios: [
            {
              situation:
                "While marking exams you find that the highest score belongs to a student you saw glancing at notes — you think. You are not certain. The student is hardworking and the family is under pressure.",
              options: [
                { text: "Speak with the student privately, present what you saw, and listen before deciding anything.", quality: 2, feedback: "Process before verdict. Certainty is not required to start a conversation; it IS required for an accusation." },
                { text: "Lower the grade quietly to compensate for the suspected advantage.", quality: 0, feedback: "A secret punishment for an unproven offense — two wrongs wearing one red pen." },
                { text: "Say nothing this time but watch closely at the next exam.", quality: 1, feedback: "Vigilance, yes — but if something happened, the silence teaches the most dangerous lesson available." },
              ],
            },
            {
              situation:
                "A colleague you like and owe favors to regularly arrives fifteen minutes late, and you've been quietly covering her class. Today the director asks you directly: 'Is everything running smoothly in the morning?'",
              options: [
                { text: "Tell your colleague today that you will no longer cover silently, and that she must resolve it before you're asked again.", quality: 2, feedback: "Loyalty to a person never outranks responsibility to thirty students — but it deserves a warning before a report." },
                { text: "Say everything is fine; she's your friend and it mostly works.", quality: 0, feedback: "The students lose fifteen minutes daily so that one friendship stays comfortable. The ledger does not balance." },
                { text: "Report the lateness to the director immediately and completely.", quality: 1, feedback: "Defensible — but skipping the direct conversation trades a fixable situation for a broken colleague relationship." },
              ],
            },
            {
              situation:
                "A parent offers you a generous gift — clearly expensive — two weeks before you finalize term grades. Refusing outright may humiliate them; their child genuinely is doing well.",
              options: [
                { text: "Decline warmly, explain the principle, and offer a detailed meeting about the child's real progress instead.", quality: 2, feedback: "The gift is replaced by the thing it was trying to buy — information and care — at no cost to fairness." },
                { text: "Accept it; the child's good grades are already earned, so no harm follows.", quality: 0, feedback: "The next gift will arrive from a family whose child is NOT doing well. The precedent is the problem." },
                { text: "Accept it but hand it to the school administration to log.", quality: 1, feedback: "Transparent, yet the family still believes a channel exists. Kind clarity would have closed it." },
              ],
            },
            {
              situation:
                "You discover a quiet student's family situation has collapsed; homework is now impossible at home. School policy: missing homework means a conduct mark. The other students are watching how rules apply.",
              options: [
                { text: "Apply the policy's spirit: arrange for him to do the work at school, and raise the policy gap with the administration.", quality: 2, feedback: "The rule's purpose is the work, not the mark. You served the purpose and started fixing the rule." },
                { text: "Apply the conduct mark; identical rules for everyone is what fairness means.", quality: 0, feedback: "Identical treatment of non-identical situations is the cheapest imitation of fairness." },
                { text: "Quietly stop checking his homework so the issue never arises.", quality: 1, feedback: "Mercy by neglect — he keeps his dignity but loses the learning, which was the point of everything." },
              ],
            },
            {
              situation:
                "In the staffroom, colleagues mock a struggling student's pronunciation, laughing. They invite you in: 'You teach him English — you must have stories!'",
              options: [
                { text: "Decline to join, and mention what the student does well — changing the room's weather without a sermon.", quality: 2, feedback: "You defended a child who will never know it, at a small social cost you'll never regret. That is the job, off-duty." },
                { text: "Laugh along briefly; staffroom culture matters and it's harmless venting.", quality: 0, feedback: "The student trusts his teachers' rooms to be safe even when he isn't in them. That trust was just spent — cheaply." },
                { text: "Lecture the staffroom on professional ethics, names included.", quality: 1, feedback: "Right value, costly delivery. The point was the student, not the trial." },
              ],
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-ethics-outro" },
    ],
    rewards: {
      experience: 220,
      statChanges: [
        { stat: "reputation", amount: 8 },
        { stat: "confidence", amount: 5 },
      ],
      itemIds: ["inspector-commendation"],
    },
    journal: {
      highScore:
        "The dilemma seminar. Five cases, no comfortable answers, and Inspector Tazi watching how each of us chose. I chose learners first, every time — even when it cost a friendship, a gift, or my own comfort. 'Not perfect — perfection is suspicious — but principled,' he said. Casablanca is next. Whatever happens at the inspection, I know what kind of teacher walks into it.",
      lowScore:
        "The dilemma seminar shook me. Some of my answers protected the wrong thing — comfort over students, smoothness over honesty — and Inspector Tazi's questions peeled that back gently and completely. 'The wrong answer is the one that makes your life easier at a student's expense.' I will be hearing that sentence at three in the morning for the rest of my career. Good. Some sentences should keep us up.",
    },
  },
];
