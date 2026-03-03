import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

type PrismHighlighter = (typeof import('react-syntax-highlighter'))['Prism'];
type PrismTheme =
  typeof import('react-syntax-highlighter/dist/esm/styles/prism').oneDark;

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [SyntaxHighlighter, setSyntaxHighlighter] =
    useState<PrismHighlighter | null>(null);
  const [syntaxTheme, setSyntaxTheme] = useState<PrismTheme | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!/```[\s\S]*?```/.test(content)) {
      return;
    }

    void Promise.all([
      import('react-syntax-highlighter'),
      import('react-syntax-highlighter/dist/esm/styles/prism'),
    ])
      .then(([highlighterModule, styleModule]) => {
        if (!isMounted) {
          return;
        }
        setSyntaxHighlighter(() => highlighterModule.Prism);
        setSyntaxTheme(styleModule.oneDark);
      })
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

          if (!inline && match && SyntaxHighlighter && syntaxTheme) {
            return (
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={syntaxTheme as any}
                language={match[1]}
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
