import { parseInline } from "./InlineParser";

import {  Quote
} from 'lucide-react';

export function parseMarkdown (text) {
  if (!text) return [];
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const trimmed = line.trim();
    
    // 1. Blockquote (> text)
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={lineIndex} className="border-l-4 border-slate-900 pl-6 my-8 italic text-xl text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-lg">
          <Quote size={24} className="text-gray-300 mb-2" />
          "{parseInline(trimmed.replace('> ', ''))}"
        </blockquote>
      );
    }
    
    // 2. List Items (- text)
    if (trimmed.startsWith('- ')) {
      return <li key={lineIndex} className="ml-6 list-disc mb-2 text-gray-700 leading-relaxed">{parseInline (trimmed.replace('- ', ''))}</li>;
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
                {imgMatch[1] && <figcaption className="text-center text-sm text-gray-500 mt-3">{imgMatch[1]}</figcaption>}
            </figure>
        );
    }
    
    // 5. Standard Paragraph
    if (trimmed === '') return <br key={lineIndex} className="mb-6" />;
    return <p key={lineIndex} className="mb-6 leading-loose text-xl text-gray-800">{parseInline(line)}</p>;
  });
};
