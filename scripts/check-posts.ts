import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { validatePostFrontmatter } from '../src/utils/postValidation';

function main() {
  const postsDir = path.join(process.cwd(), 'src', 'posts');
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
  const issues: string[] = [];

  const slugMap = new Map<string, string>();

  for (const file of files) {
    const absolutePath = path.join(postsDir, file);
    const relativePath = path.relative(process.cwd(), absolutePath);
    const raw = fs.readFileSync(absolutePath, 'utf-8');
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const normalizedSlug = slug.toLowerCase();

    if (slugMap.has(normalizedSlug)) {
      issues.push(
        `${relativePath}: duplicated slug "${slug}" conflicts with ${slugMap.get(normalizedSlug)}`
      );
    } else {
      slugMap.set(normalizedSlug, relativePath);
    }

    const frontmatterIssues = validatePostFrontmatter({
      filePath: relativePath,
      slug,
      frontmatter: data as Record<string, unknown>,
      fileExists: (coverImagePath: string) =>
        fs.existsSync(
          path.join(process.cwd(), 'public', coverImagePath.replace(/^\//, ''))
        ),
    });

    for (const issue of frontmatterIssues) {
      issues.push(`${relativePath}: ${issue}`);
    }
  }

  if (issues.length > 0) {
    console.error(`Post validation failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(`Post validation passed (${files.length} file(s) checked).`);
}

main();
