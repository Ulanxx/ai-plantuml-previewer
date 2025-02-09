import { useState } from "react";
import './index.css';
interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, type: 'new' | 'optimize') => void;
  currentUML?: string;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onSubmit, currentUML }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'new' | 'optimize'>('new');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt, type);
    setPrompt('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Generate UML with AI</h2>
        <div className="modal-type-selector">
          <div className="type-option" onClick={() => setType(type==='new' ? 'optimize' : 'new')}>
            <input
              type="checkbox"
              checked={type === 'optimize'}
              onChange={(e) => setType(e.target.checked ? 'optimize' : 'new')}
              disabled={!currentUML}
            />
            <span style={{ userSelect: 'none' }}>Optimize Current UML</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={type === 'new' ? 'Describe your UML diagram requirements...' : 'Describe how you want to optimize the current UML...'}
            rows={6}
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Generate</button>
          </div>
        </form>
      </div>
    </div>
  );
};