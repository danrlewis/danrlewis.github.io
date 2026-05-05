export type ProjectCategory =
  | "Web"
  | "Web + Mobile Web"
  | "iOS"
  | "Android"
  | "Brand"
  | "Concept";
export type ProjectStatus = "Shipped" | "Concept" | "Ongoing" | "Cancelled";

export type Project = {
  slug: string;
  index: string; // "01", "02", etc — used as visual eyebrow
  client: string;
  title: string; // short headline
  subtitle: string; // one-line description
  year: number;
  category: ProjectCategory;
  role: string;
  status: ProjectStatus;
  about: string; // 2-4 sentence project summary
  body?: string[]; // optional longer paragraphs for case study page
};

/**
 * Selected work, in display order. Edit copy as needed; metadata structure
 * is the source of truth for the work index + project pages.
 */
export const projects: Project[] = [
  {
    slug: "airbnb-afm-marketplace-pdp",
    index: "02",
    client: "Airbnb",
    title: "A web app for hourly work.",
    subtitle: "Airbnb-friendly Ambassador Dashboard",
    year: 2026,
    category: "Web + Mobile Web",
    role: "Sole Designer",
    status: "Shipped",
    about:
      "End-to-end redesign of the Snagajob web app — the search, application, and onboarding flow that hourly workers and shift-based employers use every day.",
  },
  {
    slug: "airbnb-friendly-tools",
    index: "01",
    client: "Airbnb",
    title: "Hosting tools for friendly markets.",
    subtitle: "Airbnb-friendly Tools",
    year: 2025,
    category: "Web",
    role: "Sole Designer",
    status: "Shipped",
    about:
      "Designing the host-side tooling that powers Airbnb-friendly markets — apartments and HOAs that explicitly welcome short-term hosting. Spans onboarding, compliance, payouts, and everything that happens before a listing goes live.",
  },
  {
    slug: "nectar-pdp-cart-redesign",
    index: "03",
    client: "Nectar",
    title: "A PDP and cart that earned their keep.",
    subtitle: "PDP + Cart redesign",
    year: 2019,
    category: "Web + Mobile Web",
    role: "Sole Designer",
    status: "Shipped",
    about:
      "The existing Product Detail Page and cart were a mashup of older designs with no research behind them. We rebuilt both with a real product process — research, hypothesis, testing — and the new cart drawer lifted average order size by over 25%.",
    body: [
      "The existing Product Detail Page cards and cart were a mashup of older designs, layered on top of one another over years. There was no testing, no research, and no consensus internally about what the cart was for.",
      "We rebuilt both surfaces from the ground up, this time with a real product process — research, hypothesis, testing — wrapped around every decision. The PDP card tested marginally better. The cart, which got the deepest rework, lifted average order size by over 25% via clearer hierarchy and more deliberate upsell placement.",
    ],
  },
  {
    slug: "blue-apron-android-app-design",
    index: "04",
    client: "Blue Apron",
    title: "A native Android rebrand, fully designed.",
    subtitle: "Android app design",
    year: 2018,
    category: "Android",
    role: "Sole Designer",
    status: "Cancelled",
    about:
      "Designed Blue Apron's full native Android experience as part of a broader rebrand. Because mobile was the priority, the Android designs got pushed further than the web work happening alongside. The project was cancelled before launch when leadership and priorities shifted.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Year span across all projects, e.g. "2018–2026". */
export const yearRange = (() => {
  const years = projects.map((p) => p.year);
  return `${Math.min(...years)}–${Math.max(...years)}`;
})();

/** Zero-padded total project count, e.g. "04". */
export const projectCount = String(projects.length).padStart(2, "0");
