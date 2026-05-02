import { titleFromSlug } from "../lib/routeHelpers";
import { getDomainConfig } from "../lib/domainConfig";

function familySlugFromBranchKey(branchKey = "", domainSlug = "") {
  return String(branchKey)
    .replace(new RegExp(`^${domainSlug}_`), "")
    .replace(/_/g, "-");
}

function normalizeFactor(factor = {}) {
  if (typeof factor === "string") {
    return {
      label: factor,
      body: "",
    };
  }

  return {
    label: factor?.label || factor?.title || "",
    body: factor?.body || factor?.text || factor?.description || "",
  };
}

function buildMatrix(payload = {}) {
  const branchKey = payload?.branch_key || "";
  const fallbackDomainSlug = "home-repair";
  const domainSlug = branchKey.includes("_")
    ? branchKey.split("_")[0]
    : fallbackDomainSlug;

  const domainConfig = getDomainConfig(domainSlug);
  const domainLabel = domainConfig.label || titleFromSlug(domainSlug);

  const familySlug = branchKey
    ? familySlugFromBranchKey(branchKey, domainSlug)
    : "repair-decisions";

  const familyLabel = titleFromSlug(familySlug);

  return {
    crumbs: [
      {
        label: domainLabel,
        href: `/${domainSlug}`,
      },
      {
        label: familyLabel,
        href: `/${domainSlug}/${familySlug}`,
      },
    ],
    branchLabel: payload?.branch_label ?? "",
    branchKey,
    seedId: payload?.seed_id ?? "",
    slug: payload?.slug ?? "",
    questionPattern: payload?.question_pattern ?? "",
    scenario: payload?.scenario ?? "",
    modifier: payload?.modifier ?? "",
  };
}

export function mapDecisionPayload(payload = {}) {
  return {
    hero: {
      question: payload?.hero?.question ?? payload?.title ?? "",
    },
    title: payload?.title ?? "",
    bottomLine: payload?.bottom_line ?? payload?.bottomLine ?? "",
    keyFactors: Array.isArray(payload?.key_factors)
      ? payload.key_factors.map(normalizeFactor)
      : Array.isArray(payload?.keyFactors)
        ? payload.keyFactors.map(normalizeFactor)
        : [],
    whatChangesTheAnswer: Array.isArray(payload?.what_changes_the_answer)
      ? payload.what_changes_the_answer
      : Array.isArray(payload?.whatChangesTheAnswer)
        ? payload.whatChangesTheAnswer
        : [],
    nextStep: {
      title: payload?.next_step?.title ?? payload?.nextStep?.title ?? "",
      body: payload?.next_step?.body ?? payload?.nextStep?.body ?? "",
    },
    exception: {
      title: payload?.exception?.title ?? "",
      body: payload?.exception?.body ?? "",
    },
    relatedQuestions: Array.isArray(payload?.related_questions)
      ? payload.related_questions.map((item) =>
          typeof item === "string"
            ? { title: item, slug: "" }
            : {
                title: item?.title ?? item?.question ?? "",
                slug: item?.slug ?? "",
              }
        )
      : [],
    matrix: buildMatrix(payload),
    branch_key: payload?.branch_key ?? "",
    page_id: payload?.page_id ?? payload?.id ?? "",
    id: payload?.id ?? "",
    slug: payload?.slug ?? "",
  };
}