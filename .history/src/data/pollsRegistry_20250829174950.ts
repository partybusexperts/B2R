export type PollReg = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
};

export const POLL_REGISTRY: PollReg[] = [
  {
    id: "pricing-factor",
    question: "What’s the most important factor in party bus pricing?",
    options: ["Group size", "Date/season", "Trip length", "Vehicle type"],
    tags: ["pricing", "general"],
    active: true,
  },
  {
    id: "newer-vehicle",
    question: "Would you pay more for a newer vehicle?",
    options: ["Yes", "No"],
    tags: ["fleet", "pricing"],
    active: true,
  },
  {
    id: "hourly-20p-limo",
    question: "What’s a fair hourly rate for a 20-passenger limo?",
    options: ["$100", "$150", "$200", "$250+"],
    tags: ["limo", "pricing"],
    active: true,
  },
  {
    id: "partybus_vs_limo",
    question: "Party Bus vs Limo — which would you pick?",
    options: ["Party Bus", "Limo"],
    tags: ["general", "comparison"],
    active: true,
  },
  {
    id: "event_type",
    question: "What’s your event?",
    options: ["Prom", "Wedding", "Gameday", "Birthday", "Corporate"],
    tags: ["events", "general"],
    active: true,
  },
  {
    id: "matters_most",
    question: "What matters most?",
    options: ["Price", "Space", "Lighting", "Sound", "Luggage"],
    tags: ["features", "general"],
    active: true,
  },
  {
    id: "partybus_safer",
    question: "True or False: Party buses are safer than limos.",
    options: ["True", "False"],
    tags: ["safety", "comparison"],
    active: true,
  },
  {
    id: "rent_partybus_birthday",
    question: "Would you rent a party bus for a birthday?",
    options: ["Yes", "No"],
    tags: ["events", "birthday"],
    active: true,
  },
  {
    id: "important_partybus_feature",
    question: "Which party bus feature is most important?",
    options: ["Sound System", "Lighting", "Bar", "TV Screens"],
    tags: ["features", "party-bus"],
    active: true,
  },
  {
    id: "rent_limo_birthday",
    question: "Would you rent a limousine for a birthday?",
    options: ["Yes", "No"],
    tags: ["events", "birthday"],
    active: true,
  },
  {
    id: "favorite_limo_color",
    question: "What’s your favorite limo color?",
    options: ["Black", "White", "Pink", "Silver"],
    tags: ["fun", "general"],
    active: true,
  },
];
