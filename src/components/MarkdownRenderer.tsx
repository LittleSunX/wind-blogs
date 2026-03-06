import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

type PrismLightComponent =
  typeof import('react-syntax-highlighter/dist/esm/prism-light').default;
type PrismTheme = Record<string, React.CSSProperties>;
type PrismLanguageDefinition = Parameters<
  PrismLightComponent['registerLanguage']
>[1];

type PrismLanguageModule = { default: PrismLanguageDefinition };

type MarkdownCodeProps = React.ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

type MarkdownNodeChild = {
  type?: string;
  tagName?: string;
};

type MarkdownParagraphProps = React.ComponentPropsWithoutRef<'p'> & {
  node?: {
    children?: MarkdownNodeChild[];
  };
};

interface MarkdownRendererProps {
  content: string;
}

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'bash',
] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SUPPORTED_LANGUAGE_SET = new Set<SupportedLanguage>(SUPPORTED_LANGUAGES);

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  bash: 'bash',
  sh: 'bash',
};

const LANGUAGE_MODULE_LOADERS: Record<
  SupportedLanguage,
  () => Promise<PrismLanguageModule>
> = {
  javascript: () =>
    import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  typescript: () =>
    import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  tsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  bash: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
};

const registeredLanguages = new Set<SupportedLanguage>();

function mergeClassName(baseClass: string, incoming?: string): string {
  return incoming ? `${baseClass} ${incoming}` : baseClass;
}

function isExternalLink(href?: string): boolean {
  return Boolean(href && /^https?:\/\//i.test(href));
}

function resolveLanguage(rawLanguage?: string): SupportedLanguage | undefined {
  if (!rawLanguage) {
    return undefined;
  }

  const normalized = (LANGUAGE_ALIASES[rawLanguage.toLowerCase()] ??
    rawLanguage.toLowerCase()) as string;

  if (!SUPPORTED_LANGUAGE_SET.has(normalized as SupportedLanguage)) {
    return undefined;
  }

  return normalized as SupportedLanguage;
}

function getRequestedLanguages(content: string): SupportedLanguage[] {
  const matches = content.matchAll(/```([\w-]+)/g);
  const languageSet = new Set<SupportedLanguage>();

  for (const [, rawLanguage] of matches) {
    const language = resolveLanguage(rawLanguage);
    if (language) {
      languageSet.add(language);
    }
  }

  return Array.from(languageSet);
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [SyntaxHighlighter, setSyntaxHighlighter] =
    useState<PrismLightComponent | null>(null);
  const [syntaxTheme, setSyntaxTheme] = useState<PrismTheme | null>(null);

  const requestedLanguages = useMemo(
    () => getRequestedLanguages(content),
    [content]
  );

  useEffect(() => {
    let isMounted = true;

    if (requestedLanguages.length === 0) {
      return;
    }

    void Promise.all([
      import('react-syntax-highlighter/dist/esm/prism-light'),
      import('react-syntax-highlighter/dist/esm/styles/prism'),
      ...requestedLanguages.map((language) =>
        LANGUAGE_MODULE_LOADERS[language]()
      ),
    ])
      .then(([prismLightModule, styleModule, ...languageModules]) => {
        const PrismLight = prismLightModule.default;

        requestedLanguages.forEach((language, index) => {
          if (registeredLanguages.has(language)) {
            return;
          }

          PrismLight.registerLanguage(language, languageModules[index].default);
          registeredLanguages.add(language);
        });

        if (!isMounted) {
          return;
        }

        setSyntaxHighlighter(() => PrismLight);
        setSyntaxTheme(styleModule.oneDark as PrismTheme);
      })
      .catch((error) => {
        console.error('Failed to load syntax highlighter:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [requestedLanguages]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        code({
          inline = false,
          className,
          children,
          style: _inlineStyle,
          ...props
        }: MarkdownCodeProps) {
          const match = /language-(\w+)/.exec(className || '');
          const language = resolveLanguage(match?.[1]);

          if (!inline && language && SyntaxHighlighter && syntaxTheme) {
            return (
              <SyntaxHighlighter
                style={syntaxTheme}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p({ node, children, ...props }: MarkdownParagraphProps) {
          const firstChild = node?.children?.[0];
          const isImageOnlyParagraph =
            node?.children?.length === 1 &&
            firstChild?.type === 'element' &&
            firstChild?.tagName === 'img';

          if (isImageOnlyParagraph) {
            return <>{children}</>;
          }

          return <p {...props}>{children}</p>;
        },
        img({ className, alt = '', ...props }) {
          const caption = alt.trim();

          return (
            <figure className="markdown-image-figure">
              <img
                className={mergeClassName('markdown-image', className)}
                alt={alt}
                loading="lazy"
                {...props}
              />
              {caption && (
                <figcaption className="markdown-image-caption">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        },
        table({ className, children, ...props }) {
          return (
            <div className="markdown-table-wrap">
              <table
                className={mergeClassName('markdown-table', className)}
                {...props}
              >
                {children}
              </table>
            </div>
          );
        },
        blockquote({ className, children, ...props }) {
          return (
            <blockquote
              className={mergeClassName('markdown-blockquote', className)}
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        a({ className, href, children, ...props }) {
          if (isExternalLink(href)) {
            return (
              <a
                className={mergeClassName('markdown-link', className)}
                href={href}
                rel="noreferrer noopener"
                target="_blank"
                {...props}
              >
                {children}
              </a>
            );
          }

          return (
            <a
              className={mergeClassName('markdown-link', className)}
              href={href}
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
