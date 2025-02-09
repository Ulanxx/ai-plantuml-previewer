import { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import PlantUML from 'react-plantuml';
import { toPng } from 'html-to-image';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import './App.css';

function App() {
  const [code, setCode] = useState(`@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Comic Sans MS"

' 定义参与者
actor Developer
participant "基础库" as Mothra
participant "App" as App
participant "Miniapp" as Miniapp
participant "云端" as Backend
participant "平台" as Platform
database "Data" as Data

' 开始体验评分流程
Developer -> App: 1. 开始体验评分
App -> Data: 2. 创建体验评分数据

' 运行时指标收集
group 指标收集阶段
activate App
App -> App: 3.1 获取小程序包静态分析指标
App -> App: 3.2 收集运行时指标
Mothra -> App: 3.3 收集基础库运行时指标

    ' 数据处理与存储
    App -> Data: 4. 写入指标数据
    deactivate App

end

' 结束评分流程
group 评分计算与展示阶段
Developer -> App: 5. 结束体验评分
activate App
App <-- Data: 6. 获取评分数据
App -> Miniapp: 7. 携带评分数据打开体验评分小程序
deactivate App

    activate Miniapp
    Miniapp -> Miniapp: 8. 调用 SDK 计算评分
    Miniapp -> Miniapp: 9. 展示评分报告
    Note right: 展示评分报告
    Miniapp -> Backend: 10. 上传评分数据
    Backend --> Miniapp: 11. 确认数据接收
    deactivate Miniapp

end

' 平台展示阶段
group 平台数据展示
activate Platform
Platform -> Backend: 12. 获取云端评分数据
Platform -> Platform: 13. 展示评分报告
deactivate Platform
end
@enduml`);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

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
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={30}>
          <div className="editor-pane">
            <div className="toolbar">
              <button onClick={handleExport} className="export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PNG
              </button>
            </div>
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