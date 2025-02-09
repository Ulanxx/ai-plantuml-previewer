import { useState, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import PlantUML from 'react-plantuml';
import { toPng } from 'html-to-image';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import './App.css';
import { AIModal } from './components/AIModal';

interface UMLDiagram {
  id: string;
  code: string;
  name: string;
  createdAt: string;
}

function App() {
  const [diagrams, setDiagrams] = useState<UMLDiagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<UMLDiagram | null>(null);
  const [code, setCode] = useState(`@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "PingFang SC"
actor User
actor AI

User -> AI: 1. User's request
AI -> User: 2. AI's response

@enduml`);
  const [error, setError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 从本地存储加载图表
    const savedDiagrams = localStorage.getItem('uml-diagrams');
    if (savedDiagrams) {
      const parsed = JSON.parse(savedDiagrams);
      setDiagrams(parsed);
      // 如果有图表，加载最新的一个
      if (parsed.length > 0) {
        const latest = parsed[parsed.length - 1];
        setCurrentDiagram(latest);
        setCode(latest.code);
        setDiagramName(latest.name);
      }
    }
  }, []);

  // 监听代码变化，自动保存当前图表
  useEffect(() => {
    if (currentDiagram) {
      const updatedDiagram = { ...currentDiagram, code };
      setDiagrams(prev => {
        const updated = prev.map(d => 
          d.id === currentDiagram.id ? updatedDiagram : d
        );
        localStorage.setItem('uml-diagrams', JSON.stringify(updated));
        return updated;
      });
    }
  }, [code, currentDiagram]);

  // 保存图表列表到本地存储
  useEffect(() => {
    localStorage.setItem('uml-diagrams', JSON.stringify(diagrams));
  }, [diagrams]);

  const createNewDiagram = () => {
    const defaultCode = `@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "PingFang SC"

@enduml`;
    setCode(defaultCode);
    setCurrentDiagram(null);
    setDiagramName('');
  };

  const saveDiagram = () => {
    if (!diagramName.trim()) {
      setError('Please enter a name for your diagram');
      return;
    }

    const newDiagram: UMLDiagram = {
      id: currentDiagram?.id || Date.now().toString(),
      code,
      name: diagramName,
      createdAt: new Date().toISOString(),
    };

    setDiagrams(prev => {
      const index = prev.findIndex(d => d.id === newDiagram.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newDiagram;
        return updated;
      }
      return [...prev, newDiagram];
    });

    setCurrentDiagram(newDiagram);
    setShowSaveDialog(false);
    setError('');
  };

  const loadDiagram = (diagram: UMLDiagram) => {
    setCode(diagram.code);
    setCurrentDiagram(diagram);
    setDiagramName(diagram.name);
  };

  const handleExport = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await toPng(previewRef.current);
        const link = document.createElement('a');
        link.download = 'plantuml-diagram.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        // @ts-ignore
        setError(`Failed to export diagram: ${error.message}`);
      }
    }
  };

  return (
    <div className="app-container">
      {isGenerating && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${generationProgress}%` }} />
        </div>
      )}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentUML={currentDiagram?.code}
        onSubmit={async (prompt, type) => {
          setIsAIModalOpen(false);
          setIsGenerating(true);
          
          // 在实际实现中，这里会根据 type 来决定是优化当前 UML 还是创建新的
          
          // Mock AI generation process
          for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setGenerationProgress(i);
          }

          // Mock response - in real implementation, this would be the response from deepseek
          const mockUmlCode = `@startuml\nskinparam backgroundColor transparent\nactor User\nparticipant System\n\nUser -> System: Request\nSystem --> User: Response\n@enduml`;
          
          setCode(mockUmlCode);
          setIsGenerating(false);
          setGenerationProgress(0);
        }}
      />
      <div className="toolbar">
        <button onClick={createNewDiagram} className="new-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New
        </button>
        <button onClick={() => setShowSaveDialog(true)} className="save-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
        <button onClick={() => setIsAIModalOpen(true)} className="ai-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          AI Generate
        </button>
        <button onClick={handleExport} className="export-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PNG
        </button>
      </div>

      {showSaveDialog && (
        <div className="modal-overlay">
          <div className="modal-content save-dialog">
            <h2>{currentDiagram ? 'Save Diagram' : 'Save New Diagram'}</h2>
            <input
              type="text"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              placeholder="Enter diagram name"
              className="diagram-name-input"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="modal-buttons">
              <button type="button" onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button type="submit" onClick={saveDiagram}>Save</button>
            </div>
          </div>
        </div>
      )}

      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15}>
          <div className="diagrams-sidebar">
            <div className="sidebar-header">
              <h2>Saved Diagrams</h2>
            </div>
            <div className="diagrams-list">
              {diagrams.map(diagram => (
                <div
                  key={diagram.id}
                  className={`diagram-item ${currentDiagram?.id === diagram.id ? 'active' : ''}`}
                  onClick={() => loadDiagram(diagram)}
                >
                  <div className="diagram-info">
                    <span className="diagram-name">{diagram.name}</span>
                    <span className="diagram-date">
                      {new Date(diagram.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {diagrams.length === 0 && (
                <div className="no-diagrams">
                  No saved diagrams yet
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        <Panel defaultSize={40} minSize={30}>
          <div className="editor-pane">
            <CodeMirror
              value={code}
              onChange={(value) => setCode(value)}
              height="calc(100vh - 60px)"
              theme="light"
              extensions={[]}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="resize-handle">
          <div className="handle-bar" />
        </PanelResizeHandle>

        <Panel minSize={30}>
          <div className="preview-pane" ref={previewRef}>
              <PlantUML
              src={code}
              alt="PlantUML Diagram"
            />
            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;