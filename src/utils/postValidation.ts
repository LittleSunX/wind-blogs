interface ValidatePostFrontmatterInput {
  filePath: string;
  slug: string;
  frontmatter: Record<string, unknown>;
  fileExists: (path: string) => boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === value;
}

function isValidDateValue(value: unknown): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value === 'string') {
    return isValidDateString(value);
  }

  return false;
}

export function validatePostFrontmatter({
  frontmatter,
  fileExists,
}: ValidatePostFrontmatterInput): string[] {
  const issues: string[] = [];

  if (typeof frontmatter.title !== 'string' || !frontmatter.title.trim()) {
    issues.push('title is required and must be a non-empty string');
  }

  if (!isValidDateValue(frontmatter.date)) {
    issues.push('date must be in YYYY-MM-DD format');
  }

  if (
    frontmatter.excerpt !== undefined &&
    (typeof frontmatter.excerpt !== 'string' || !frontmatter.excerpt.trim())
  ) {
    issues.push('excerpt must be a non-empty string when provided');
  }

  if (frontmatter.tags !== undefined) {
    if (
      !Array.isArray(frontmatter.tags) ||
      frontmatter.tags.some((tag) => typeof tag !== 'string' || !tag.trim())
    ) {
      issues.push('tags must be an array of non-empty strings when provided');
    }
  }

  if (frontmatter.coverImage !== undefined) {
    if (
      typeof frontmatter.coverImage !== 'string' ||
      !frontmatter.coverImage.trim()
    ) {
      issues.push('coverImage must be a non-empty string when provided');
    } else if (frontmatter.coverImage.startsWith('/')) {
      if (!fileExists(frontmatter.coverImage)) {
        issues.push(
          `coverImage points to a missing file in public directory: ${frontmatter.coverImage}`
        );
      }
    } else if (!/^https?:\/\//i.test(frontmatter.coverImage)) {
      issues.push(
        'coverImage must be an absolute path (/...) or a valid http(s) URL'
      );
    }
  }

  return issues;
}
