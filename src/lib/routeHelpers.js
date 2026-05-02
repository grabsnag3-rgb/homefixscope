export function slugifyLabel(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function titleFromSlug(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseBranchLabel(branchLabel = "") {
  const pieces =
    typeof branchLabel === "string"
      ? branchLabel.split("→").map((part) => part.trim())
      : [];

  return {
    domainLabel: pieces[0] ?? "",
    familyLabel: pieces[1] ?? "",
    branchLabel: pieces[2] ?? "",
  };
}

export function makeClusterHref(branchLabel = "") {
  const { domainLabel, familyLabel } = parseBranchLabel(branchLabel);
  return `/${slugifyLabel(domainLabel)}/${slugifyLabel(familyLabel)}`;
}

export function makeDecisionHref(branchLabel = "", slug = "") {
  const { domainLabel, familyLabel } = parseBranchLabel(branchLabel);
  return `/${slugifyLabel(domainLabel)}/${slugifyLabel(familyLabel)}/${slug}`;
}