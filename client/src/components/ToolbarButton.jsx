function ToolbarButton({ title, icon, onClick, active }) {
  return <button onClick={onClick} title={title} className={`p-2 rounded-lg text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-slate-900 ${active ? 'bg-gray-100 text-slate-900' : ''}`}>{icon}</button>;
}

export default ToolbarButton;