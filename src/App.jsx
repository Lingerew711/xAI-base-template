import React, { useState, useRef } from 'react';

const LiveEditor = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeEditor, setActiveEditor] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const htmlRef = useRef(null);
  const cssRef = useRef(null);

  const htmlTags = [
    'div', 'span', 'p', 'a', 'img', 'link', 'meta', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'ul', 'li', 'ol', 'form', 'input', 'button', 'select', 'option', 'textarea', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'article', 'section', 'aside', 'nav'
  ];
  const cssProperties = [
    'color', 'background', 'padding', 'margin', 'display', 'flex', 'position', 'border', 'width', 'height', 'font-size', 'text-align', 'vertical-align', 'line-height', 'background-color', 'border-radius', 'opacity', 'box-shadow', 'text-decoration'
  ];

  const handleEditorChange = (event, dictionary, triggerChar, editor, ref) => {
    const value = event.target.value;
    switch (editor) {
      case 'html':
        setHtml(value);
        break;
      case 'css':
        setCss(value);
        break;
    }
    setActiveEditor(editor);
    handleSuggestions(value, dictionary, triggerChar);
    updateCursorPosition(ref);
  };

  const updateCursorPosition = (ref) => {
    if (!ref.current) return;
    const range = ref.current.selectionStart;
    const text = ref.current.value.slice(0, range);
    const textLines = text.split('\n');
    const lastLine = textLines[textLines.length - 1];
    const lineIndex = textLines.length;

    ref.current.style.position = 'relative';
    const { height } = ref.current.getBoundingClientRect();
    const lineHeight = parseInt(getComputedStyle(ref.current).lineHeight);
    const cursorX = lastLine.length * (lineHeight / 2);
    const cursorY = lineHeight * (lineIndex - 1);

    setCursorPos({ x: cursorX, y: cursorY });
  };

  const handleSuggestions = (value, dictionary, triggerChar) => {
    const parts = value.split(triggerChar);
    const lastPart = parts[parts.length - 1];
    if (lastPart.length > 0 && lastPart.trim().length) {
      setShowSuggestions(true);
      setSuggestions(dictionary.filter(item => item.startsWith(lastPart.trim())));
    } else {
      setShowSuggestions(false);
    }
  };

  const insertItem = (item) => {
    let newText;
    switch (activeEditor) {
      case 'html':
        newText = `<${item}></${item}>`;
        setHtml(newText);
        break;
      case 'css':
        newText = `${css}{${item}: ;}`;
        setCss(newText);
        break;
    }
    setShowSuggestions(false);
  };

  const createMarkup = () => {
    return { __html: `<style>${css}</style>${html}` };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-10">
      <div className="flex flex-1">
        <textarea
          ref={htmlRef}
          className="flex-1 m-2 p-4 border border-gray-300 rounded-lg resize-none"
          value={html}
          onChange={(e) => handleEditorChange(e, htmlTags, '<', 'html', htmlRef)}
          placeholder="Enter HTML"
          style={{ height: '50vh' }} // Adjust height to 50% of the viewport height
        />
        <textarea
          ref={cssRef}
          className="flex-1 m-2 p-4 border border-gray-300 rounded-lg resize-none"
          value={css}
          onChange={(e) => handleEditorChange(e, cssProperties, '{', 'css', cssRef)}
          placeholder="Enter CSS"
          style={{ height: '50vh' }} // Adjust height to 50% of the viewport height
        />
      </div>
      {showSuggestions && (
        <ul style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y + 20}px` }} className="absolute z-10 w-auto bg-white border border-gray-300 rounded-md shadow-lg list-none p-2">
          {suggestions.map((item, index) => (
            <li key={index} className="p-1 cursor-pointer hover:bg-gray-200" onClick={() => insertItem(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
      <iframe
        title="result"
        className="w-full flex-1"
        srcDoc={createMarkup().__html}
        sandbox="allow-scripts"
        style={{ height: '50vh' }} // Ensure the iframe also takes up 50% of the viewport height
      />
    </div>
  );
};

export default LiveEditor;
