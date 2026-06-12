import type { QuestDefinition } from "@/types";

export const EL_JADIDA_QUESTS: QuestDefinition[] = [
  {
    id: "glass-of-milk",
    cityId: "el-jadida",
    title: "Could I Have a Glass of Milk, Please?",
    category: "teaching-practice",
    difficulty: 2,
    summary: "Build a complete PPP lesson teaching quantities and polite requests to the 2nd years.",
    story:
      "Mrs. Fassi's school, Mrs. Fassi's standards. Selma must teach quantity expressions — some, any, a glass of, a bottle of — wrapped in polite requests. The lesson lives or dies by its staging, and tonight Selma builds it stage by stage.",
    objectives: [
      { id: "o1", description: "Sequence the lesson stages in sound pedagogical order" },
      { id: "o2", description: "Teach the class to order food and drink politely" },
      { id: "o3", description: "Earn Mrs. Fassi's window-side approval" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-glass-of-milk-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "lesson-sequence",
          title: "Build the Lesson",
          instructions:
            "Arrange the stages of the quantities lesson into the correct pedagogical order, from first to last.",
          correctOrder: [
            { id: "s1", label: "Warm-up", detail: "Café roleplay scene-setter: the teacher 'orders' from a surprised student." },
            { id: "s2", label: "Presentation", detail: "Introduce 'some/any' and containers (a glass of, a bottle of) through the café picture story." },
            { id: "s3", label: "Controlled practice", detail: "Gap-fill: students complete polite requests with the right quantity words." },
            { id: "s4", label: "Freer practice", detail: "Pair roleplay: customer and waiter improvise café orders." },
            { id: "s5", label: "Production", detail: "Groups write and perform their own café scene with three polite requests." },
            { id: "s6", label: "Wrap-up & homework", detail: "Recap the key phrases; assign a shopping-list dialogue for home." },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-glass-of-milk-outro" },
    ],
    rewards: {
      experience: 150,
      statChanges: [
        { stat: "teachingSkill", amount: 7 },
        { stat: "englishKnowledge", amount: 4 },
      ],
      itemIds: ["lesson-plan-quantities"],
    },
    journal: {
      highScore:
        "The milk lesson worked. On paper it was boxes and arrows; in the room it became a café where every customer says please. Mrs. Fassi watched from the window twice — which Khadija tells me is the El Jadida equivalent of a standing ovation. I think I love planning. Don't tell my Safi self, she wouldn't believe it.",
      lowScore:
        "The milk lesson survived, which is not nothing. My stages got tangled — production before the practice was ready, and the café roleplay nearly became an actual food fight (imaginary food, real chaos). But Mrs. Fassi said something useful through her disappointment: the order of the stages IS the lesson. Rebuilding it tonight. Properly.",
    },
  },
  {
    id: "weather-forecast",
    cityId: "el-jadida",
    title: "Weather Forecast",
    category: "english-challenge",
    difficulty: 2,
    summary: "Teach weather vocabulary with examples vivid enough to satisfy Amine's press conference.",
    prerequisites: ["glass-of-milk"],
    story:
      "Sunny, cloudy, windy, stormy — easy words, hard to make memorable. With resident meteorology enthusiast Amine watching her every move, Selma must craft examples that stick to El Jadida like sea fog to the ramparts.",
    objectives: [
      { id: "o1", description: "Anchor each weather word in a vivid, local example" },
      { id: "o2", description: "Run the classroom weather-forecast activity" },
      { id: "o3", description: "Answer at least one impossible question from Amine" },
    ],
    steps: [
      { kind: "dialogue", dialogueId: "q-weather-intro" },
      {
        kind: "minigame",
        minigame: {
          kind: "grammar-challenge",
          title: "Engaging Examples",
          instructions:
            "For each teaching moment, choose the example or technique that will make the weather vocabulary stick.",
          questions: [
            {
              prompt: "You introduce 'foggy'. Which example will the El Jadida students feel in their bones?",
              options: [
                "'Foggy: when you cannot see the end of the ramparts in the morning.'",
                "'Foggy: characterized by reduced visibility due to suspended water droplets.'",
                "'Foggy: the opposite of clear.'",
                "'Foggy: like in London, England.'",
              ],
              correctIndex: 0,
              explanation:
                "Local and sensory beats abstract and distant. They have all seen the ramparts vanish into the morning fog.",
            },
            {
              prompt: "Amine asks: 'Teacher, what is between cloudy and rainy?' The best teaching response:",
              options: [
                "'Overcast — the sky is full of clouds, the rain is deciding.' Then have the class mime a deciding sky.",
                "'There is nothing between them, Amine.'",
                "'That's too advanced for this lesson.'",
                "'Look it up at home.'",
              ],
              correctIndex: 0,
              explanation:
                "Curiosity is fuel. A vivid answer plus a whole-class action turns one student's question into everyone's vocabulary.",
            },
            {
              prompt: "To practice 'windy', the most engaging activity is:",
              options: [
                "Students give a TV forecast for Moroccan cities with a paper microphone, gesturing the wind.",
                "Students copy 'windy' ten times in their notebooks.",
                "The teacher describes wind for three minutes.",
                "Students silently read a paragraph about wind.",
              ],
              correctIndex: 0,
              explanation:
                "Performance plus gesture plus real city names — memory loves all three. The paper microphone does heavy pedagogical lifting.",
            },
            {
              prompt: "A student confuses 'sunny' and 'hot'. You clarify with:",
              options: [
                "'A winter morning in Safi can be sunny AND cold — sun is what you see, hot is what you feel.'",
                "'They are basically the same thing.'",
                "'Sunny is an adjective of solar luminosity.'",
                "'Don't worry about the difference.'",
              ],
              correctIndex: 0,
              explanation:
                "A concrete contrast case unpicks the confusion exactly where it lives — and every student has shivered in sunshine.",
            },
            {
              prompt: "To close the lesson memorably, you:",
              options: [
                "Have the class forecast tomorrow's REAL weather, then check it tomorrow — vocabulary with a cliffhanger.",
                "List all eight weather words one more time.",
                "Announce a surprise weather test for tomorrow.",
                "End five minutes early as a reward.",
              ],
              correctIndex: 0,
              explanation:
                "A prediction creates an open loop — tomorrow's check makes them think about English outside the classroom tonight.",
            },
          ],
        },
      },
      { kind: "dialogue", dialogueId: "q-weather-outro" },
    ],
    rewards: {
      experience: 150,
      statChanges: [
        { stat: "classroomManagement", amount: 5 },
        { stat: "teachingSkill", amount: 4 },
        { stat: "confidence", amount: 3 },
      ],
      itemIds: ["weather-flashcards"],
    },
    journal: {
      highScore:
        "Weather day. The classroom became a TV studio: paper microphone, dramatic wind gestures, Amine forecasting Casablanca wind 'with one hundred percent certainty because of my uncle's hat'. They'll remember 'overcast' forever, and so will I. When the words live in their world, they stay.",
      lowScore:
        "Weather day. Some examples landed, others evaporated — 'reduced visibility' got the blank stares it deserved. Amine rescued me twice with questions better than my material. Note to self, in capital letters: TEACH THE WEATHER THEY CAN SEE FROM THE WINDOW. The abstract is where vocabulary goes to be forgotten.",
    },
  },
];
