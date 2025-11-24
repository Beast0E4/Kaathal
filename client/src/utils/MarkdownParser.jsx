import { Quote } from 'lucide-react';

/**
 * Internal helper to parse inline styles:
 * 1. Highlights (<mark>)
 * 2. Bold (**)
 * 3. Italic (_)
 */
const parseInline = (text) => {
  if (!text) return null;

  // 1. Split by the custom <mark> tag
  // Regex captures the full tag so we can process it
  const parts = text.split(/(<mark style="background-color: .*?;">.*?<\/mark>)/g);

  return parts.map((part, index) => {
    // Check if this part is a highlight
    const highlightMatch = part.match(/<mark style="background-color: (.*?);">(.*?)<\/mark>/);

    if (highlightMatch) {
      const [, color, content] = highlightMatch; // Extract color and inner text
      return (
        <mark 
          key={index} 
          style={{ backgroundColor: color, color: 'inherit' }} 
          className="px-0.5 rounded-sm"
        >
          {/* Recursively parse bold/italic inside the highlight */}
          {parseStandardFormatting(content)}
        </mark>
      );
    }

    // If not a highlight, parse standard Markdown
    return <span key={index}>{parseStandardFormatting(part)}</span>;
  });
};

// Helper to handle **Bold** and _Italic_
const parseStandardFormatting = (text) => {
  // Split by Bold (**)
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    
    // Split by Italic (_)
    const italicParts = part.split(/(_.*?_)/g);
    return italicParts.map((subPart, j) => {
      if (subPart.startsWith('_') && subPart.endsWith('_')) {
        return <em key={j} className="italic">{subPart.slice(1, -1)}</em>;
      }
      return subPart;
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
        <blockquote key={lineIndex} className="border-l-4 border-slate-900 pl-6 my-8 italic text-xl text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-lg">
          <Quote size={24} className="text-gray-300 mb-2" />
          {parseInline(trimmed.replace('> ', ''))}
        </blockquote>
      );
    }

    // 2. List Items (- text)
    if (trimmed.startsWith('- ')) {
      return <li key={lineIndex} className="ml-6 list-disc mb-2 text-gray-700 leading-relaxed">{parseInline(trimmed.replace('- ', ''))}</li>;
    }

    // 3. Headings (## text)
    if (trimmed.startsWith('## ')) {
      return <h2 key={lineIndex} className="text-3xl font-bold mt-12 mb-6 text-slate-900 tracking-tight">{parseInline(trimmed.replace('## ', ''))}</h2>;
    }

    // 4. Images ( ![alt](url) ) - Block level detection
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      return (
        <figure key={lineIndex} className="my-10 group">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full rounded-xl shadow-sm border border-gray-100" />
          {/* {imgMatch[1] && <figcaption className="text-center text-sm text-gray-500 mt-3">{imgMatch[1]}</figcaption>} */}
        </figure>
      );
    }

    // 5. Standard Paragraph
    if (trimmed === '') return <br key={lineIndex} className="mb-6" />;
    return <p key={lineIndex} className="mb-6 leading-loose text-xl text-gray-800">{parseInline(line)}</p>;
  });
};