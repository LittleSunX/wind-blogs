import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

type PrismLightComponent =
  typeof import('react-syntax-highlighter/dist/esm/prism-light').default;
type PrismTheme =
  typeof import('react-syntax-highlighter/dist/esm/styles/prism').oneDark;

type PrismLanguageModule = { default: unknown };

interface MarkdownRendererProps {
  content: string;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  bash: 'bash',
  sh: 'bash',
};

let languagesRegistered = false;

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [SyntaxHighlighter, setSyntaxHighlighter] =
    useState<PrismLightComponent | null>(null);
  const [syntaxTheme, setSyntaxTheme] = useState<PrismTheme | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!/```[\s\S]*?```/.test(content)) {
      return;
    }

    void Promise.all([
      import('react-syntax-highlighter/dist/esm/prism-light'),
      import('react-syntax-highlighter/dist/esm/styles/prism'),
      import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
      import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
      import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
      import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
      import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
    ])
      .then(
        ([
          prismLightModule,
          styleModule,
          javascriptModule,
          typescriptModule,
          jsxModule,
          tsxModule,
          bashModule,
        ]) => {
          const PrismLight = prismLightModule.default;

          if (!languagesRegistered) {
            PrismLight.registerLanguage(
              'javascript',
              (javascriptModule as PrismLanguageModule).default
            );
            PrismLight.registerLanguage(
              'typescript',
              (typescriptModule as PrismLanguageModule).default
            );
            PrismLight.registerLanguage(
              'jsx',
              (jsxModule as PrismLanguageModule).default
            );
            PrismLight.registerLanguage(
              'tsx',
              (tsxModule as PrismLanguageModule).default
            );
            PrismLight.registerLanguage(
              'bash',
              (bashModule as PrismLanguageModule).default
            );
            languagesRegistered = true;
          }

          if (!isMounted) {
            return;
          }

          setSyntaxHighlighter(() => PrismLight);
          setSyntaxTheme(styleModule.oneDark);
        }
      )
      .catch((error) => {
        console.error('Failed to load syntax highlighter:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match
            ? (LANGUAGE_ALIASES[match[1].toLowerCase()] ??
              match[1].toLowerCase())
            : undefined;

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
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
