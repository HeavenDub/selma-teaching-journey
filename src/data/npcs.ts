import type { NpcDefinition } from "@/types";

export const NPCS: NpcDefinition[] = [
  {
    id: "mr-alaoui",
    name: "Mr. Alaoui",
    role: "mentor-teacher",
    cityId: "safi",
    portrait: { emoji: "👨🏽‍🏫", background: "#2a9d8f" },
    biography:
      "Twenty-two years in Safi classrooms have given Mr. Alaoui a calm that no chaotic Monday can shake. He believes every great teacher was once a terrified trainee, and he never lets Selma forget it kindly.",
    chatDialogueId: "chat-mr-alaoui",
    storyArc: [
      { minRelationship: 0, text: "Mr. Alaoui watches Selma quietly during observations, taking his own notes about her." },
      { minRelationship: 30, text: "He admits he once froze completely during his own first lesson — for two full minutes." },
      { minRelationship: 60, text: "He shares his personal archive of lesson plans, twenty years of refinements in a worn leather folder." },
    ],
  },
  {
    id: "dr-benhaddouche",
    name: "Dr. Benhaddouche",
    role: "crmef-supervisor",
    cityId: "safi",
    portrait: { emoji: "👨🏽‍🦳", background: "#9d4f88" },
    biography:
      "The old lion of CRMEF Safi. White-haired, slow-walking, forty years of pedagogy in one cardigan, Dr. Benhaddouche reads every observation sheet twice and has outlasted six reforms, four ministers and one earthquake. He is demanding because he has watched too many half-prepared teachers sink — and he refuses to launch another one.",
    chatDialogueId: "chat-dr-bennani",
    storyArc: [
      { minRelationship: 0, text: "Dr. Benhaddouche's red pen is famous among trainees. So is his habit of being right." },
      { minRelationship: 30, text: "He mentions, between two corrections, that he wrote his doctoral thesis on teacher resilience in rural Morocco — by lamplight, in 1986." },
      { minRelationship: 60, text: "He tells Selma: 'I push hardest the ones I believe in. At my age, I do not waste ink on the others.' The red pen suddenly looks different." },
    ],
  },
  {
    id: "saadia",
    name: "Saadia",
    role: "teacher-trainee",
    cityId: "safi",
    portrait: { emoji: "🧕🏽", background: "#457b9d" },
    biography:
      "A big-hearted trainee from Essaouira with a bright scarf for every day of the week and a laugh that fills the whole staffroom. Saadia is endlessly kind, hides her own nerves behind warmth, and no matter how heavy the week gets, she always finds a way to make Selma laugh.",
    chatDialogueId: "chat-saadia",
    storyArc: [
      { minRelationship: 0, text: "Saadia declares the trainee room 'far too serious' and fixes it with one perfectly timed joke." },
      { minRelationship: 30, text: "She shows Selma her secret notebook of funny classroom moments, 'saved up for the hard days'." },
      { minRelationship: 60, text: "After her own micro-teaching triumph, she credits Selma's advice — loudly, warmly, in front of everyone." },
    ],
  },
  {
    id: "mrs-fassi",
    name: "Mrs. Fassi",
    role: "school-director",
    cityId: "el-jadida",
    portrait: { emoji: "👩🏽‍🏫", background: "#bc6c25" },
    biography:
      "Director of the El Jadida middle school, Mrs. Fassi runs her corridors like a captain runs a ship. She judges trainees within thirty seconds — and is privately delighted when they prove her first impression wrong.",
    chatDialogueId: "chat-mrs-fassi",
    storyArc: [
      { minRelationship: 0, text: "Mrs. Fassi greets Selma with a look that itemizes her entire outfit and posture." },
      { minRelationship: 30, text: "She starts calling Selma 'our trainee' instead of 'the trainee'. The staff room notices." },
      { minRelationship: 60, text: "She hints that there is always a place in her school for teachers who care this much." },
    ],
  },
  {
    id: "amine",
    name: "Amine",
    role: "student",
    cityId: "el-jadida",
    portrait: { emoji: "👦🏽", background: "#588157" },
    biography:
      "The kid in the third row who answers every question — usually before being asked. Amine loves English cartoons and tests every new teacher with exactly one very hard question about the weather.",
    chatDialogueId: "chat-amine",
    storyArc: [
      { minRelationship: 0, text: "Amine asks Selma if it can rain and be sunny at the same time. He awaits her answer gravely." },
      { minRelationship: 30, text: "He starts bringing English comic books to show Selma before class." },
      { minRelationship: 60, text: "He announces to the class that he will be an English teacher too. 'Like Miss Selma.'" },
    ],
  },
  {
    id: "khadija",
    name: "Khadija",
    role: "teacher-trainee",
    cityId: "azemmour",
    portrait: { emoji: "👩🏽‍🎓", background: "#e76f51" },
    biography:
      "A meticulous trainee who color-codes everything and owns seventeen highlighters. Khadija's portfolio is legend, but she works herself to exhaustion and is slowly learning that rest is also professional.",
    chatDialogueId: "chat-khadija",
    storyArc: [
      { minRelationship: 0, text: "Khadija's binder has tabs. The tabs have tabs." },
      { minRelationship: 30, text: "She admits she hasn't slept properly since the internship started, and laughs a little too long." },
      { minRelationship: 60, text: "She and Selma make a pact: no portfolio work after ten at night. Mostly they keep it." },
    ],
  },
  {
    id: "si-brahim",
    name: "Si Brahim",
    role: "administrative-staff",
    cityId: "azemmour",
    portrait: { emoji: "👴🏽", background: "#6c757d" },
    biography:
      "Keeper of the Azemmour school archives and the only person who knows where the stapler is. Si Brahim has watched forty years of trainees pass through and rates them by how politely they ask for paper.",
    chatDialogueId: "chat-si-brahim",
    storyArc: [
      { minRelationship: 0, text: "Si Brahim guards the photocopier like a national treasure. In fairness, it is one." },
      { minRelationship: 30, text: "He slips Selma an extra ream of paper 'for emergencies'. This is a great honor." },
      { minRelationship: 60, text: "He shows her a drawer of thank-you notes from forty years of teachers he helped." },
    ],
  },
  {
    id: "mr-tahiri",
    name: "Mr. Tahiri",
    role: "mentor-teacher",
    cityId: "bir-jdid",
    portrait: { emoji: "🧔🏽", background: "#bc8a2f" },
    biography:
      "Bir Jdid's assessment specialist, famous for the question 'But what are you measuring?' Mr. Tahiri can spot a poorly designed quiz from across the room and believes fair testing is a form of respect for students.",
    chatDialogueId: "chat-mr-tahiri",
    storyArc: [
      { minRelationship: 0, text: "Mr. Tahiri grades Selma's first quiz draft. There is a lot of green ink. Green is worse." },
      { minRelationship: 30, text: "He explains why he never uses trick questions: 'A test is a conversation, not an ambush.'" },
      { minRelationship: 60, text: "He asks Selma to co-design the term test — an honor he gives almost no trainee." },
    ],
  },
  {
    id: "souad",
    name: "Souad",
    role: "parent",
    cityId: "had-soualem",
    portrait: { emoji: "🧕🏽", background: "#7d6bb5" },
    biography:
      "Mother of three and force of nature on the parents' committee, Souad commutes to Casablanca daily and still never misses a school meeting. She asks teachers hard questions because her children deserve hard-working answers.",
    chatDialogueId: "chat-souad",
    storyArc: [
      { minRelationship: 0, text: "Souad asks Selma, kindly but precisely, what her plan is for the slower learners." },
      { minRelationship: 30, text: "She brings the trainees msemen on open day. Morale rises by an unmeasurable amount." },
      { minRelationship: 60, text: "She tells Selma her eldest started reading English stories at home. 'That was you.'" },
    ],
  },
  {
    id: "inspector-tazi",
    name: "Inspector Tazi",
    role: "inspector",
    cityId: "casablanca",
    portrait: { emoji: "🕴🏽", background: "#d62847" },
    biography:
      "The inspector whose visit reorganizes entire schools. Behind the formidable briefcase is a man who has read every pedagogy book twice and wants exactly one thing: teachers who put learners first.",
    chatDialogueId: "chat-inspector-tazi",
    storyArc: [
      { minRelationship: 0, text: "Inspector Tazi's reputation arrives in Had Soualem three weeks before he does." },
      { minRelationship: 30, text: "He is seen, once, smiling at a student's joke. Witnesses are still discussing it." },
      { minRelationship: 60, text: "He tells Selma the inspection is not a trap: 'I am not here to catch you failing. I am here to catch you teaching.'" },
    ],
  },
];

export const NPC_INDEX: Record<string, NpcDefinition> = Object.fromEntries(
  NPCS.map((n) => [n.id, n]),
);

export function getNpc(id: string): NpcDefinition {
  const npc = NPC_INDEX[id];
  if (!npc) throw new Error(`Unknown NPC: ${id}`);
  return npc;
}

export const NPC_ROLE_LABELS: Record<NpcDefinition["role"], string> = {
  "mentor-teacher": "Mentor Teacher",
  "school-director": "School Director",
  inspector: "Inspector",
  "teacher-trainee": "Teacher Trainee",
  student: "Student",
  parent: "Parent",
  "crmef-supervisor": "CRMEF Supervisor",
  "administrative-staff": "Administrative Staff",
};
