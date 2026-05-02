export const SKILLS = [
  "Claude",
  "GitHub Copilot",
  "Prompt Engineering",
  "TypeScript",
  "Golang",
  "Java",
  "C#",
  "ReactJS",
  "NextJS",
  "VueJS",
  "MeteorJS",
  "Springboot",
  "AWS",
  "Kubernetes",
  "Kafka",
  "CosmosDB",
  "MongoDB",
  "Postgres",
  "Docker",
  "Azure",
] as const;

export interface Fact {
  key: string;
  val: string;
}

export const FACTS: Fact[] = [
  { key: "Location", val: "Herndon, VA" },
  { key: "Experience", val: "15+ years" },
  { key: "Education", val: "BS Computer Science, Dickinson College" },
];

export interface Hobby {
  title: string;
  desc: string;
}

export const HOBBIES: Hobby[] = [
  { title: "Video & board games", desc: "Strategy, RPGs, and the occasional rabbit hole." },
  { title: "Poker", desc: "A break-even player at best." },
  { title: "Cooking", desc: "Mostly improvised. Occasionally impressive." },
];

export interface Highlight {
  title: string;
  sub: string;
}

export interface HighlightGroup {
  label?: string;
  highlights: Highlight[];
}

export const HIGHLIGHT_GROUPS: HighlightGroup[] = [
  {
    highlights: [
      {
        title: "Making a Difference Award",
        sub: "Engineering Excellence · Walmart CTO, 2024",
      },
    ],
  },
  {
    label: "At Craft Education",
    highlights: [
      {
        title: "Evolved system design and capabilities",
        sub: "From single-digit jobs per day to a theoretical limit of tens of thousands",
      },
      {
        title: "Shipped a greenfield MVP on time",
        sub: "Small team, tight timeline, zero runway for slip",
      },
    ],
  },
  {
    label: "At Walmart",
    highlights: [
      {
        title: "~$500k/yr cloud savings",
        sub: "Optimization & horizontal/vertical scaling",
      },
      {
        title: "2× faster · 70× the throughput",
        sub: "Single Golang service, same hardware",
      },
      {
        title: "Backend powering every cash register in the continental US",
        sub: "Scaled from 100 brick-and-mortar stores to 4,500",
      },
    ],
  },
];
