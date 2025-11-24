import { Quote, ExternalLink } from 'lucide-react';

/**
 * Internal helper to parse inline styles:
 * 1. Highlights (<mark>)
 * 2. Bold (**)
 * 3. Italic (_)
 * 4. Links ([text](url))
 */
const parseInline = (text) => {
  if (!text) return null;

  // 1. Split by the custom <mark> tag
  const parts = text.split(/(<mark style="background-color: .*?;">.*?<\/mark>)/g);

  return parts.map((part, index) => {
    const highlightMatch = part.match(/<mark style="background-color: (.*?);">(.*?)<\/mark>/);

    if (highlightMatch) {
      const [, color, content] = highlightMatch; 
      return (
        <mark 
          key={index} 
          style={{ backgroundColor: color, color: 'inherit' }} 
          className="px-0.5 rounded-sm"
        >
          {parseStandardFormatting(content)}
        </mark>
      );
    }

    return <span key={index}>{parseStandardFormatting(part)}</span>;
  });
};

// Helper to handle **Bold**, _Italic_, and [Link](url)
const parseStandardFormatting = (text) => {
  // 1. Split by Bold (**)
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    
    // 2. Split by Italic (_)
    const italicParts = part.split(/(_.*?_)/g);
    return italicParts.map((subPart, j) => {
      if (subPart.startsWith('_') && subPart.endsWith('_')) {
        return <em key={j} className="italic">{subPart.slice(1, -1)}</em>;
      }

      // 3. Split by Links ([text](url))
      const linkParts = subPart.split(/(\[.*?\]\(.*?\))/g);
      
      return linkParts.map((linkPart, k) => {
        const linkMatch = linkPart.match(/^\[(.*?)\]\((.*?)\)$/);

        if (linkMatch) {
            const [, linkText, linkUrl] = linkMatch;
            return (
                <a 
                    key={k} 
                    href={linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-700 text-[1rem] hover:text-blue-900 hover:underline decoration-blue-300 underline-offset-2 transition-colors cursor-pointer break-words"
                >
                    {linkUrl}
                </a>
            );
        }
        
        return linkPart;
      });
    });
  });
};


export function parseMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    const trimmed = line.trim();

    // 1. Blockquote (> text)
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={lineIndex} className="border-l-4 border-slate-900 pl-6 my-6 italic text-xl text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-lg">
          <Quote size={24} className="text-gray-300 mb-2" />
          {parseInline(trimmed.replace('> ', ''))}
        </blockquote>
      );
    }

    // 2. List Items (- text)
    if (trimmed.startsWith('- ')) {
      return <li key={lineIndex} className="ml-6 list-disc mb-2 text-xl text-gray-800 leading-relaxed">{parseInline(trimmed.replace('- ', ''))}</li>;
    }

    // 3. Headings (## text)
    if (trimmed.startsWith('## ')) {
      return <h2 key={lineIndex} className="text-3xl font-bold mt-10 mb-4 text-slate-900 tracking-tight">{parseInline(trimmed.replace('## ', ''))}</h2>;
    }

    // 4. Images ( ![alt](url) )
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      return (
        <figure key={lineIndex} className="my-8 group">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full rounded-xl shadow-sm border border-gray-100" />
        </figure>
      );
    }

    // 5. Standard Paragraph
    if (trimmed === '') return <br key={lineIndex} className="" />;
    
    // UPDATED: Reduced margins (mb-4) and line-height (leading-relaxed) for tighter fit
    return <p key={lineIndex} className="mb-4 leading-relaxed text-xl text-gray-800">{parseInline(line)}</p>;
  });
};