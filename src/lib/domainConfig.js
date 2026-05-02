export const DOMAIN_CONFIG = {
  leak: {
    key: "leak",
    label: "Leaks & water intrusion",
    motif: "field-grid",
    accent: "safety-orange",
    domainIntro:
      "Repair timing, hidden damage risk, leak source uncertainty, temporary fixes, and quote decisions.",
    clusterIntro:
      "Browse leak and water-intrusion decision guides by repair situation, risk level, and next step.",
    families: {
      "Ceiling & wall leaks":
        "Stains, active dripping, spreading damage, rain-related leaks, and hidden moisture concerns.",
      "Basement & crawlspace water":
        "Seepage, standing water, sump pump issues, grading concerns, and moisture control decisions.",
      "Source uncertainty":
        "When the leak source is unclear, intermittent, behind finishes, or disputed by contractors.",
      "Temporary fixes":
        "Buckets, tarps, sealants, shutoffs, drying steps, and when a temporary fix is not enough.",
      "Water damage risk":
        "Mold risk, wet insulation, damaged drywall, flooring concerns, and when to open things up.",
      "Leak quotes & scope":
        "What should be included in a repair quote, when to get another opinion, and what scope gaps matter.",
    },
  },

  roofing: {
    key: "roofing",
    label: "Roofing",
    motif: "measurement-grid",
    accent: "muted-brass",
    domainIntro:
      "Patch-vs-replace choices, leak diagnosis, repair timing, material decisions, and roof quote scope.",
    clusterIntro:
      "Browse roofing decision guides by damage type, timing pressure, quote scope, and replacement tradeoff.",
    families: {
      "Patch vs replace":
        "When a roof repair is enough, when replacement is safer, and what age or damage changes the call.",
      "Roof leak diagnosis":
        "Rain leaks, flashing issues, vent leaks, chimney leaks, valleys, and hard-to-find entry points.",
      "Storm & weather timing":
        "Temporary protection, weather windows, active leaks, and when delaying creates more damage.",
      "Materials & roof age":
        "Shingles, flat roofing, metal roofing, underlayment, decking, and age-related repair limits.",
      "Roof quotes":
        "Scope, line items, warranties, decking assumptions, ventilation, and contractor disagreement.",
    },
  },

  hvac: {
    key: "hvac",
    label: "HVAC",
    motif: "system-lines",
    accent: "clay",
    domainIntro:
      "Repair-vs-replace decisions, system age, urgent failures, contractor quotes, and comfort tradeoffs.",
    clusterIntro:
      "Browse HVAC decision guides by failure type, system age, repair cost, urgency, and comfort risk.",
    families: {
      "Repair vs replace":
        "When a repair still makes sense, when replacement is more practical, and how system age affects the decision.",
      "No heat or no cooling":
        "Urgent failures, unsafe temperatures, emergency calls, temporary options, and repair timing.",
      "System performance":
        "Weak airflow, uneven rooms, short cycling, noise, humidity, and recurring comfort problems.",
      "Equipment age & parts":
        "Old systems, unavailable parts, refrigerant issues, major components, and future repair risk.",
      "HVAC quotes":
        "What should be included, when to compare quotes, sizing questions, warranties, and scope gaps.",
    },
  },

  plumbing: {
    key: "plumbing",
    label: "Plumbing",
    motif: "pipe-layout",
    accent: "safety-orange",
    domainIntro:
      "Leaks, clogs, fixture failures, pipe concerns, DIY-vs-pro choices, and repair quote questions.",
    clusterIntro:
      "Browse plumbing decision guides by leak type, clog severity, fixture issue, safety risk, and repair scope.",
    families: {
      "Leaks & shutoffs":
        "Active leaks, slow leaks, valve issues, supply lines, appliance connections, and when to shut water off.",
      "Clogs & backups":
        "Slow drains, recurring clogs, main-line concerns, sewer backups, and when DIY clearing is risky.",
      "Fixtures & appliances":
        "Toilets, faucets, sinks, tubs, showers, water heaters, dishwashers, and washing-machine connections.",
      "Pipe condition":
        "Old pipes, corrosion, freezing risk, water pressure, repipe questions, and hidden pipe concerns.",
      "DIY vs plumber":
        "When a homeowner repair is reasonable and when permits, access, or damage risk make a pro safer.",
      "Plumbing quotes":
        "Scope, access cuts, pipe material, cleanup, warranties, and when to get another quote.",
    },
  },

  foundation: {
    key: "foundation",
    label: "Foundation & structure",
    motif: "structural-grid",
    accent: "muted-brass",
    domainIntro:
      "Cracks, settling, structural warning signs, repair timing, inspection decisions, and quote scope.",
    clusterIntro:
      "Browse foundation and structure decision guides by warning sign, movement risk, inspection need, and repair scope.",
    families: {
      "Cracks & movement":
        "Foundation cracks, stair-step cracks, widening gaps, sticking doors, sloping floors, and settlement signs.",
      "Water near foundation":
        "Drainage, grading, basement moisture, crawlspace water, gutters, and soil movement concerns.",
      "Structural warning signs":
        "Sagging, bowing, shifting, load concerns, damaged beams, and when an issue needs urgent review.",
      "Inspection decisions":
        "When to call a structural engineer, foundation contractor, home inspector, or waterproofing company.",
      "Repair scope & quotes":
        "Piers, underpinning, crack repair, drainage work, waterproofing, and quote comparison questions.",
    },
  },

  electrical: {
    key: "electrical",
    label: "Electrical",
    motif: "circuit-field",
    accent: "clay",
    domainIntro:
      "Safety concerns, breaker issues, fixture problems, DIY-vs-pro decisions, and electrical quote questions.",
    clusterIntro:
      "Browse electrical decision guides by safety concern, failure pattern, repair urgency, and pro-vs-DIY risk.",
    families: {
      "Safety concerns":
        "Burning smells, sparks, heat, buzzing, shocks, flickering, and when to stop using a circuit.",
      "Breakers & panels":
        "Tripping breakers, overloaded circuits, old panels, subpanels, GFCI/AFCI issues, and service questions.",
      "Fixtures & devices":
        "Outlets, switches, lights, fans, appliances, dimmers, and when replacement is not the whole fix.",
      "DIY vs electrician":
        "When a simple swap is reasonable and when code, permits, panels, or hidden wiring make it unsafe.",
      "Electrical quotes":
        "Scope, troubleshooting time, panel work, permits, materials, access, and quote comparison decisions.",
    },
  },
};

export function getDomainConfig(domainSlug = "") {
  return (
    DOMAIN_CONFIG[domainSlug] || {
      key: domainSlug,
      label: domainSlug
        ? domainSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Home repair",
      motif: "field-grid",
      accent: "safety-orange",
      domainIntro:
        "Browse practical repair decision guides for timing, cost, risk, DIY-vs-pro choices, and quote scope.",
      clusterIntro:
        "Browse this branch of HomeFixScope decision guides and move into individual repair questions from here.",
      families: {},
    }
  );
}