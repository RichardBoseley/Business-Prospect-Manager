/**
 * Seed data lifted verbatim from the design prototype
 * (design_handoff_outreach_crm/Game On Outreach.dc.html) — 15 businesses,
 * 3 promotions, contacts, notes and the do-not-contact register.
 */

import type {
  Business,
  Contact,
  DNCEntry,
  Note,
  Promotion,
  SavedList,
  Workspace,
} from "../types";

export const seedWorkspace: Workspace = {
  name: "Game On Entertainment Centre",
  location: "Cranbourne West VIC",
  venues: [
    {
      id: "cranbourne-west",
      name: "Game On Cranbourne West",
      address: "14 Marriott Waters Bvd, Cranbourne West VIC 3977",
    },
    {
      id: "frankston",
      name: "Game On Frankston",
      address: "88 Wells St, Frankston VIC 3199",
    },
  ],
  primaryVenueId: "cranbourne-west",
  namedAreas: [
    "Cranbourne",
    "Clyde North",
    "Berwick",
    "Narre Warren",
    "Frankston",
    "Dandenong",
    "Pakenham",
    "Melbourne CBD",
  ],
  dailySendLimit: 30,
  showRationale: true,
};

/** Areas pre-selected in the Find businesses criteria. */
export const seedSelectedAreas = ["Cranbourne", "Clyde North", "Berwick"];

export const seedBusinessTypes: Record<string, boolean> = {
  "Dance school": true,
  Gym: true,
  "Childcare centre": true,
  "Real estate agency": true,
  "Accounting firm": true,
  Pub: true,
  "Sports club": true,
  "Primary school": true,
  Plumber: false,
  Florist: false,
  Physiotherapist: false,
  "Café": false,
  "Hair salon": false,
  "Vet clinic": false,
};

export const seedIndustries: Record<string, boolean> = {
  Hospitality: true,
  Education: true,
  "Professional services": true,
  Health: true,
  Trades: false,
  Retail: false,
  "Sport & recreation": true,
};

export const seedPromotions: Promotion[] = [
  {
    id: "xmas",
    name: "Christmas Corporate Parties",
    status: "Active",
    description:
      "Exclusive-use party areas, catering and group rates for end-of-year functions.",
    sellingPoints: [
      "Exclusive-use party rooms",
      "VR + laser tag group packages",
      "Catering & drinks options",
    ],
    audiences: [
      "Offices & professional firms",
      "Sports clubs & teams",
      "Schools & childcare centres",
    ],
    photos: [],
    metrics: { targets: 12, sent: 23, opened: 14, clicked: 6, replied: 3 },
  },
  {
    id: "holiday",
    name: "School Holiday Group Deals",
    status: "Active",
    description:
      "Weekday group rates for schools, clubs and care programs these holidays.",
    sellingPoints: [],
    audiences: [],
    photos: [],
    metrics: { targets: 18, sent: 30, opened: 19, clicked: 8, replied: 5 },
  },
  {
    id: "team",
    name: "Weekday Team Building",
    status: "Draft",
    description:
      "Off-peak team-building sessions — VR challenges and laser tag leagues.",
    sellingPoints: [],
    audiences: [],
    photos: [],
    metrics: { targets: 0, sent: 0, opened: 0, clicked: 0, replied: 0 },
  },
];

/** AI-suggested selling points offered in the wizard (on = pre-ticked). */
export const seedSuggestedSellingPoints = [
  { label: "Exclusive-use party rooms", on: true, ai: true },
  { label: "VR + laser tag group packages", on: true, ai: true },
  { label: "Catering & drinks options", on: true, ai: true },
  { label: "Group rates for 10+", on: false, ai: true },
  { label: "Weeknight availability in December", on: false, ai: true },
];

/** Suggested audience cards offered in the wizard. */
export const seedSuggestedAudiences = [
  {
    label: "Offices & professional firms",
    hint: "accounting, legal, real estate, agencies",
    on: true,
  },
  {
    label: "Sports clubs & teams",
    hint: "presentation nights, season wrap-ups",
    on: true,
  },
  {
    label: "Schools & childcare centres",
    hint: "staff celebrations, not student groups",
    on: true,
  },
  {
    label: "Hospitality venues",
    hint: "staff parties outside their own venue",
    on: false,
  },
  { label: "Trades & crews", hint: "small-team Christmas dos", on: false },
];

const contact = (
  id: string,
  name: string,
  role: string,
  email?: string,
  phone?: string,
  isPrimary = false,
): Contact => ({ id, name, role, email, phone, isPrimary });

export const seedBusinesses: Business[] = [
  {
    id: "stepz",
    name: "Stepz Dance Academy",
    suburb: "Berwick",
    type: "Dance school",
    industry: "Education",
    sizeBand: "S",
    contactMethod: "named",
    email: "sarah@stepzdance.com.au",
    phone: "(03) 9702 4418",
    website: "stepzdance.com.au",
    abn: "84 612 330 417",
    entityName: "Stepz Dance Academy Pty Ltd",
    address: "12 Clyde Rd, Berwick VIC 3806",
    driveTime: "14 min",
    fit: 92,
    rationale:
      "Dance school running end-of-term concerts — strong fit for group party offer",
    stage: "Replied",
    lastActivity: "Replied 2h ago",
    aiSummary:
      "Family-run studio with ~120 enrolled students across jazz, hip hop and contemporary. Runs end-of-term concerts and school-holiday workshops.",
    hook:
      "Saw the Term 4 concert dates on your site — if you run a wrap party for students, families or your teaching team, our party rooms and VR floor handle big groups well.",
    dnc: false,
    contacts: [
      contact(
        "stepz-sarah",
        "Sarah Nguyen",
        "Studio Manager",
        "sarah@stepzdance.com.au",
        "(03) 9702 4418",
        true,
      ),
      contact(
        "stepz-jack",
        "Jack Fielding",
        "Owner",
        "jack@stepzdance.com.au",
        "0412 883 921",
      ),
    ],
  },
  {
    id: "harcourt",
    name: "Harcourt & Vine Accounting",
    suburb: "Cranbourne",
    type: "Accounting firm",
    industry: "Professional services",
    sizeBand: "M",
    contactMethod: "email",
    email: "admin@harcourtvine.com.au",
    phone: "(03) 5995 2280",
    website: "harcourtvine.com.au",
    abn: "31 447 902 118",
    entityName: "Harcourt & Vine Pty Ltd",
    address: "Suite 4, 88 High St, Cranbourne VIC 3977",
    driveTime: "6 min",
    fit: 88,
    rationale: "Accounting firm, ~15 staff — good fit for Christmas function",
    stage: "Replied",
    lastActivity: "Replied yesterday",
    aiSummary:
      "Suburban accounting practice, ~15 staff across tax and bookkeeping. Active on LinkedIn; posts about staff culture.",
    hook:
      "End-of-year functions for teams your size are our bread and butter — private karaoke rooms after a VR tournament tends to be the crowd favourite with office teams.",
    dnc: false,
    contacts: [
      contact(
        "harcourt-tom",
        "Tom Harcourt",
        "Partner",
        "tom@harcourtvine.com.au",
        "(03) 5995 2280",
        true,
      ),
    ],
  },
  {
    id: "southside",
    name: "Southside Property Group",
    suburb: "Clyde North",
    type: "Real estate agency",
    industry: "Professional services",
    sizeBand: "M",
    contactMethod: "named",
    email: "marcus@southsideproperty.com.au",
    phone: "(03) 5991 7744",
    website: "southsideproperty.com.au",
    abn: "77 210 664 903",
    entityName: "Southside Property Group Pty Ltd",
    address: "2/145 Berwick-Cranbourne Rd, Clyde North VIC 3978",
    driveTime: "9 min",
    fit: 86,
    rationale: "Sales team of ~12 plus rentals — runs quarterly team events",
    stage: "Clicked",
    lastActivity: "Clicked yesterday",
    aiSummary:
      "Residential agency covering Clyde North and Cranbourne growth corridor. ~12 sales agents plus a property management team.",
    hook:
      "Your team page mentions quarterly celebration nights — laser tag between the sales and rentals teams settles the office rivalry properly.",
    dnc: false,
    contacts: [
      contact(
        "southside-marcus",
        "Marcus Bellini",
        "Director",
        "marcus@southsideproperty.com.au",
        "(03) 5991 7744",
        true,
      ),
      contact(
        "southside-priya",
        "Priya Shah",
        "Office Manager",
        "priya@southsideproperty.com.au",
      ),
    ],
  },
  {
    id: "ironbark",
    name: "Ironbark Fitness",
    suburb: "Frankston",
    type: "Gym",
    industry: "Health",
    sizeBand: "M",
    contactMethod: "email",
    email: "info@ironbarkfitness.com.au",
    phone: "(03) 9781 3356",
    website: "ironbarkfitness.com.au",
    abn: "52 883 419 260",
    entityName: "Ironbark Fitness Pty Ltd",
    address: "7 Playne St, Frankston VIC 3199",
    driveTime: "22 min",
    fit: 83,
    rationale:
      "24/7 gym, 8 staff and an active member community — social night potential",
    stage: "Clicked",
    lastActivity: "Clicked 5h ago",
    aiSummary:
      "Independent 24/7 gym with 8 staff and ~900 members. Runs member challenges and social events each quarter.",
    hook:
      "A members social night that is not just another barbecue — VR fitness challenges and laser tag suit a gym crowd perfectly.",
    dnc: false,
    contacts: [],
  },
  {
    id: "sprouts",
    name: "Little Sprouts Early Learning",
    suburb: "Cranbourne West",
    type: "Childcare centre",
    industry: "Education",
    sizeBand: "M",
    contactMethod: "email",
    email: "director@littlesprouts.net.au",
    phone: "(03) 5996 0412",
    website: "littlesprouts.net.au",
    abn: "19 302 587 441",
    entityName: "Little Sprouts Early Learning Pty Ltd",
    address: "31 Strathlea Dr, Cranbourne West VIC 3977",
    driveTime: "4 min",
    fit: 81,
    rationale: "Three-room centre, ~20 educators — staff Christmas party fit",
    stage: "Contacted",
    lastActivity: "Reminder due today",
    aiSummary:
      "Long-day-care centre with three rooms and ~20 educators. Five minutes from the venue.",
    hook:
      "Your team spends all year looking after everyone else — a staff Christmas night four minutes up the road is an easy one to say yes to.",
    dnc: false,
    contacts: [],
  },
  {
    id: "duke",
    name: "The Duke Hotel",
    suburb: "Dandenong",
    type: "Pub",
    industry: "Hospitality",
    sizeBand: "L",
    contactMethod: "email",
    email: "functions@thedukehotel.com.au",
    phone: "(03) 9792 6688",
    website: "thedukehotel.com.au",
    abn: "44 095 771 328",
    entityName: "Duke Hospitality Group Pty Ltd",
    address: "214 Lonsdale St, Dandenong VIC 3175",
    driveTime: "18 min",
    fit: 79,
    rationale: "Function-focused pub, ~35 staff — strong staff-party fit",
    stage: "Booked",
    lastActivity: "Booked 11 Jul",
    aiSummary:
      "Large suburban pub with bistro and function rooms, ~35 staff across kitchen, bar and floor.",
    hook:
      "Hospitality teams are the hardest to organise a party for — you host everyone else all December. We run late sessions that work around service.",
    dnc: false,
    contacts: [],
  },
  {
    id: "cmps",
    name: "Cranbourne Meadows Primary",
    suburb: "Cranbourne",
    type: "Primary school",
    industry: "Education",
    sizeBand: "L",
    contactMethod: "phone",
    phone: "(03) 5996 8833",
    website: "cranmeadowsps.vic.edu.au",
    abn: "—",
    entityName: "Dept. of Education (Vic)",
    address: "55 Meadowvale Dr, Cranbourne VIC 3977",
    driveTime: "7 min",
    fit: 76,
    rationale:
      "Large staff room (~45 teachers) — end-of-year celebration fit",
    stage: "Selected",
    lastActivity: "Selected 5 Jul",
    aiSummary:
      "Government primary school, ~45 teaching and support staff. Social club organises the end-of-year event.",
    hook:
      "For a staff room of 45, the end-of-year night needs somewhere that handles a big group without splitting it up — that is exactly what we are built for.",
    dnc: false,
    contacts: [],
  },
  {
    id: "bayside",
    name: "Bayside Physio & Co",
    suburb: "Frankston",
    type: "Physiotherapist",
    industry: "Health",
    sizeBand: "S",
    contactMethod: "email",
    email: "reception@baysidephysio.com.au",
    phone: "(03) 9783 2190",
    website: "baysidephysio.com.au",
    abn: "68 550 236 917",
    entityName: "Bayside Physio & Co Pty Ltd",
    address: "118 Beach St, Frankston VIC 3199",
    driveTime: "23 min",
    fit: 74,
    rationale:
      "Growing allied-health clinic, 6 practitioners — small team outing fit",
    stage: "Contacted",
    lastActivity: "Emailed 8 Jul",
    aiSummary:
      "Allied-health clinic with 6 practitioners and 3 admin staff. Recently expanded into a second suite.",
    hook:
      "Small-team Christmas parties are easy to get wrong — too small for a function room, too big for a dinner table. Our group packages start at 8 people.",
    dnc: false,
    contacts: [],
  },
  {
    id: "peninsula",
    name: "Peninsula Plumbing Co",
    suburb: "Cranbourne",
    type: "Plumber",
    industry: "Trades",
    sizeBand: "S",
    contactMethod: "phone",
    phone: "0418 552 007",
    website: "peninsulaplumbing.com.au",
    abn: "23 664 108 552",
    entityName: "Peninsula Plumbing Co Pty Ltd",
    address: "Cranbourne VIC 3977",
    driveTime: "8 min",
    fit: 71,
    rationale: "Crew of ~5 — books an annual Christmas do",
    stage: "New",
    lastActivity: "Found 3 Jul",
    aiSummary:
      "Residential plumbing crew of ~5. Phone and web form only — no published email.",
    hook:
      "A crew Christmas do with laser tag and a karaoke room beats the same pub as last year.",
    dnc: false,
    contacts: [],
  },
  {
    id: "bloom",
    name: "Berwick Bloom Florist",
    suburb: "Berwick",
    type: "Florist",
    industry: "Retail",
    sizeBand: "S",
    contactMethod: "email",
    email: "hello@berwickbloom.com.au",
    phone: "(03) 9707 4451",
    website: "berwickbloom.com.au",
    abn: "91 738 425 660",
    entityName: "K & J Nguyen Partnership",
    address: "6 Blackburne Sq, Berwick VIC 3806",
    driveTime: "15 min",
    fit: 68,
    rationale: "Two-person shop — likely too small for the group offer",
    stage: "New",
    lastActivity: "Found 3 Jul",
    aiSummary: "Boutique florist, two staff. Strong local Instagram presence.",
    hook:
      "Even a team of two deserves a proper end-of-year night — our packages start small.",
    dnc: false,
    contacts: [],
  },
  {
    id: "cougars",
    name: "Casey Cougars Basketball Club",
    suburb: "Narre Warren",
    type: "Sports club",
    industry: "Sport & recreation",
    sizeBand: "M",
    contactMethod: "named",
    email: "secretary@caseycougars.org.au",
    phone: "0402 118 664",
    website: "caseycougars.org.au",
    abn: "70 441 902 385",
    entityName: "Casey Cougars Basketball Club Inc.",
    address: "Narre Warren VIC 3805",
    driveTime: "12 min",
    fit: 66,
    rationale:
      "Junior and senior squads — presentation night and team celebration fit",
    stage: "Potential",
    lastActivity: "Note added 10 Jul",
    aiSummary:
      "Community basketball club, 14 junior and 4 senior teams. Runs an annual presentation night for ~200 people.",
    hook:
      "Presentation season is coming — we do club nights where the courts do the talking: VR, laser tag and party rooms for squads of any size.",
    dnc: false,
    contacts: [
      contact(
        "cougars-dana",
        "Dana Okafor",
        "Club Secretary",
        "secretary@caseycougars.org.au",
        "0402 118 664",
        true,
      ),
    ],
  },
  {
    id: "clydeosteo",
    name: "Clyde North Osteopathy",
    suburb: "Clyde North",
    type: "Osteopath",
    industry: "Health",
    sizeBand: "S",
    contactMethod: "phone",
    phone: "(03) 5991 2038",
    website: "clydenorthosteo.com.au",
    abn: "85 226 990 143",
    entityName: "Clyde North Osteopathy Pty Ltd",
    address: "Shop 3, 10 Selandra Blvd, Clyde North VIC 3978",
    driveTime: "10 min",
    fit: 63,
    rationale: "Solo practitioner with 2 support staff — marginal fit",
    stage: "Selected",
    lastActivity: "Selected 5 Jul",
    aiSummary: "Single-practitioner clinic with two reception staff.",
    hook:
      "A small-team celebration close to home — group packages from 8 people.",
    dnc: false,
    contacts: [],
  },
  {
    id: "fag",
    name: "Frankston Auto Group",
    suburb: "Frankston",
    type: "Car dealership",
    industry: "Retail",
    sizeBand: "L",
    contactMethod: "email",
    email: "reception@frankstonauto.com.au",
    phone: "(03) 9784 5500",
    website: "frankstonauto.com.au",
    abn: "36 118 664 209",
    entityName: "Frankston Auto Group Pty Ltd",
    address: "400 Nepean Hwy, Frankston VIC 3199",
    driveTime: "24 min",
    fit: 61,
    rationale:
      "Dealership, ~30 staff across sales and service — strong function fit",
    stage: "Contacted",
    lastActivity: "Emailed 8 Jul",
    aiSummary:
      "Multi-brand dealership with ~30 staff across sales, service and parts. Contacted in March for the autumn promotion; no reply.",
    hook:
      "Sales versus service laser tag — the grudge match your workshop has been waiting for, plus party rooms for the whole dealership.",
    previouslyContacted: { period: "Mar 2026" },
    dnc: false,
    contacts: [],
  },
  {
    id: "rsl",
    name: "Dandenong RSL",
    suburb: "Dandenong",
    type: "Club",
    industry: "Hospitality",
    sizeBand: "L",
    contactMethod: "email",
    email: "events@dandenongrsl.com.au",
    phone: "(03) 9792 1535",
    website: "dandenongrsl.com.au",
    abn: "50 004 561 883",
    entityName: "Dandenong RSL Sub-branch Inc.",
    address: "44 Clow St, Dandenong VIC 3175",
    driveTime: "19 min",
    fit: 58,
    rationale: "Runs its own function rooms — likely a competitor for events",
    stage: "Opened",
    lastActivity: "Opened 8 Jul",
    aiSummary:
      "Large RSL club with bistro, gaming and function spaces, ~40 staff.",
    hook:
      "Your team hosts functions all year — for your own staff night, come somewhere nobody has to work the room.",
    dnc: false,
    contacts: [],
  },
  {
    id: "sandhurst",
    name: "Sandhurst Signs",
    suburb: "Cranbourne West",
    type: "Signwriter",
    industry: "Trades",
    sizeBand: "S",
    contactMethod: "email",
    email: "jobs@sandhurstsigns.com.au",
    phone: "0417 300 281",
    website: "sandhurstsigns.com.au",
    abn: "62 909 114 758",
    entityName: "Sandhurst Signs Pty Ltd",
    address: "Unit 9, 4 Fleet St, Cranbourne West VIC 3977",
    driveTime: "3 min",
    fit: 55,
    rationale: "Owner asked not to be contacted",
    stage: "Not interested",
    lastActivity: "Unsubscribed 14 Jun",
    aiSummary: "Two-person signwriting workshop.",
    hook: "",
    dnc: true,
    contacts: [],
  },
];

/** Businesses each non-default promotion has touched (xmas touches all). */
export const seedPromotionMembers: Record<string, string[]> = {
  holiday: ["stepz", "sprouts", "cmps", "cougars"],
  team: ["harcourt", "southside", "ironbark", "fag"],
};

/** Follow-up queue on the dashboard: replied/clicked and not yet actioned. */
export const seedFollowUpQueueIds = ["stepz", "ironbark", "harcourt", "sprouts"];

export const seedSavedLists: SavedList[] = [
  {
    id: "warm",
    label: "Warm leads",
    memberIds: ["southside", "ironbark", "stepz", "harcourt"],
  },
  { id: "pot", label: "Potentials", memberIds: ["cougars"] },
  {
    id: "stale",
    label: "No contact 30+ days",
    memberIds: ["peninsula", "bloom", "cmps", "clydeosteo"],
  },
];

/** Detailed notes already on file (headline shows in the timeline). */
export const seedDetailedNotes: Record<string, Note[]> = {
  stepz: [
    {
      headline: "Spoke to Sarah, call back in August",
      body:
        "Sarah is keen but Term 4 concert prep runs to late July. She suggested talking to Jack Fielding (owner) about budget sign-off before locking a date. Call week of 4 Aug.",
      date: "10 Jul",
      author: "Jess",
    },
  ],
};

/** Businesses pre-ticked on the shortlist (top matches, no flags). */
export const seedSelectedIds = seedBusinesses
  .filter((b) => !b.dnc && !b.previouslyContacted && b.fit >= 61)
  .map((b) => b.id);

/** Emails already approved on the campaign copy screen. */
export const seedApprovedIds = [
  "stepz",
  "harcourt",
  "southside",
  "ironbark",
  "sprouts",
  "duke",
  "cmps",
  "bayside",
];

export const seedDncEntries: DNCEntry[] = [
  {
    businessName: "Sandhurst Signs",
    detail: "Signwriter · Cranbourne West",
    reason: "Unsubscribed via link",
    date: "14 Jun 2026",
    permanent: true,
  },
  {
    businessName: "Clarinda Park Function Centre",
    detail: "Function venue · Cranbourne",
    reason: "Requested by reply",
    date: "2 Jun 2026",
    permanent: true,
  },
  {
    businessName: "Botanic Ridge Wines",
    detail: "Winery · Botanic Ridge",
    reason: "Manual",
    date: "28 May 2026",
    permanent: true,
  },
];

/** Weekly KPI figures shown on the dashboard. */
export const seedDashboardStats = {
  sentThisWeek: 118,
  sentToday: 23,
  opens: 74,
  openRate: "63%",
  clicks: 22,
  clickNote: "19% of sent",
  replies: 9,
  repliesNote: "3 this week",
  warmLeads: 4,
};
