export function parseInline (text) {
  // Tokens: **bold**, _italic_, ==highlight==
  const parts = text.split(/(\*\*.*?\*\*|_.*?_|==.*?==)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('==') && part.endsWith('==')) {
        return <mark key={i} className="bg-yellow-200 text-slate-900 px-1 rounded-sm selection:bg-yellow-300">{part.slice(2, -2)}</mark>;
    }
    return part;
  });
};