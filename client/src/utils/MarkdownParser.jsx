import { Quote } from 'lucide-react';

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
          className="px-0.5 rounded-sm decoration-clone box-decoration-clone"
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
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
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

            // --- Logic to extract Domain Name ---
            let domainName = linkUrl;
            try {
                // Check if protocol exists, if not add https for parsing
                const urlToParse = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
                const urlObj = new URL(urlToParse);
                domainName = urlObj.hostname.replace(/^www\./, ''); // Removes 'www.' for a cleaner look
            } catch (e) {
                // If URL is invalid, fallback to linkText or original URL
                domainName = linkText || linkUrl;
            }
            // ------------------------------------

            return (
                <a 
                    key={k} 
                    href={linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    // Responsive text size and word breaking for mobile safety
                    className="text-blue-700 hover:text-blue-900 hover:underline decoration-blue-300 underline-offset-2 transition-colors cursor-pointer break-words"
                >
                    {/* Display only the domain name */}
                    {domainName}
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
        <blockquote key={lineIndex} className="border-l-4 border-slate-900 bg-gray-50 rounded-r-lg text-gray-700 italic my-6 pl-4 py-3 pr-3 text-lg sm:pl-6 sm:py-4 sm:pr-4 sm:text-xl">
          <Quote className="text-gray-300 mb-2 w-5 h-5 sm:w-6 sm:h-6" />
          <div className="leading-relaxed">
             {parseInline(trimmed.replace('> ', ''))}
          </div>
        </blockquote>
      );
    }

    // 2. List Items (- text)
    if (trimmed.startsWith('- ')) {
      return (
        <li key={lineIndex} className="list-disc text-gray-800 leading-relaxed mb-2 ml-4 text-lg sm:ml-6 sm:text-xl">
            {parseInline(trimmed.replace('- ', ''))}
        </li>
      );
    }

    // 3. Headings (## text)
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={lineIndex} className="font-bold text-slate-900 tracking-tight leading-tight mb-3 text-2xl sm:text-3xl">
            {parseInline(trimmed.replace('## ', ''))}
        </h2>
      );
    }

    // 4. Images ( ![alt](url) )
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      return (
        <figure key={lineIndex} className="group">
          <img 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            className="w-full rounded-xl shadow-sm border border-gray-100 object-cover" 
            loading="lazy"
          />
        </figure>
      );
    }

    // 5. Standard Paragraph
    if (trimmed === '') return <div key={lineIndex} className="h-4 sm:h-6" />;
    
    // Default text: Text-lg on mobile, Text-xl on desktop
    return (
        <p key={lineIndex} className="leading-relaxed text-gray-800 mb-4 text-lg sm:mb-5 sm:text-xl">
            {parseInline(line)}
        </p>
    );
  });
};