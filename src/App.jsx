import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// List of HTML tags for autocompletion
const htmlTags = ['div', 'p', 'span', 'h1', 'h2', 'button', 'input', 'a'];
// List of CSS properties for autocompletion
const cssProperties = ['color', 'background-color', 'margin', 'padding', 'width', 'height'];

const CodeEditor = ({ language, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textAreaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
    if (language === 'html' && e.target.value.endsWith('<')) {
      const lastWord = e.target.value.split('<').pop().toLowerCase();
      setSuggestions(htmlTags.filter(tag => tag.startsWith(lastWord)));
      setShowSuggestions(true);
    } else if (language === 'css') {
      const words = e.target.value.split(/\s+|:/);
      const lastWord = words[words.length - 1].toLowerCase();
      setSuggestions(cssProperties.filter(prop => prop.startsWith(lastWord)));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion) => {
    let currentValue = textAreaRef.current.value;
    let newValue = currentValue.replace(/<\w*$/, `<${suggestion}></${suggestion}>`);
    if (language === 'css') {
      newValue = currentValue.replace(/\w*$/, `${suggestion}: ;`);
    }
    onChange(newValue);
    textAreaRef.current.focus();
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <textarea 
        ref={textAreaRef}
        onChange={handleChange}
        className="w-full h-48 p-2 border rounded-md resize-none"
        placeholder={`Type ${language} here...`}
      />
      {showSuggestions && (
        <div className="absolute top-0 left-0 bg-white border p-2 rounded shadow">
          {suggestions.map(s => 
            <div key={s} onClick={() => insertSuggestion(s)} className="cursor-pointer hover:bg-gray-100">
              {s}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const outputRef = useRef(null);

  const updateOutput = () => {
    if (outputRef.current) {
      outputRef.current.srcdoc = `
        <html>
          <head><style>${css}</style></head>
          <body>${html}</body>
        </html>`;
    }
  };

  React.useEffect(updateOutput, [html, css]);

  return (
    <div className="container mx-auto p-4 sm:flex sm:space-x-4">
      <Card className="sm:w-1/2 mb-4 sm:mb-0">
        <CardHeader>
          <CardTitle>HTML Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor language="html" onChange={setHtml} />
        </CardContent>
      </Card>

      <Card className="sm:w-1/2">
        <CardHeader>
          <CardTitle>CSS Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor language="css" onChange={setCss} />
        </CardContent>
      </Card>

      <div className="mt-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe ref={outputRef} title="Output" className="w-full h-96 border-none" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;