import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const htmlTags = ['div', 'p', 'span', 'h1', 'h2', 'a', 'img', 'button'];
const cssProperties = ['color', 'background-color', 'font-size', 'margin', 'padding'];

function App() {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const htmlRef = useRef(null);

  const handleHtmlChange = (e) => {
    let value = e.target.value;
    setHtmlCode(value);
    
    // Suggestion logic
    if (value.endsWith('<')) {
      const lastChar = value.slice(-2, -1).toLowerCase();
      const filteredTags = htmlTags.filter(tag => tag.startsWith(lastChar));
      setSuggestions(filteredTags);
    } else {
      setSuggestions([]);
    }
  };

  const handleCssChange = (e) => {
    let value = e.target.value;
    setCssCode(value);
    
    // Basic suggestion for CSS properties
    if (value.endsWith(':')) {
      const lastWord = value.split(' ').pop().split(':')[0];
      const filteredProps = cssProperties.filter(prop => prop.startsWith(lastWord));
      setSuggestions(filteredProps);
    } else {
      setSuggestions([]);
    }
  };

  const insertSuggestion = (suggestion) => {
    const currentText = htmlRef.current.value;
    const newText = currentText.replace(/<[^>]*$/, `<${suggestion}></${suggestion}>`);
    setHtmlCode(newText);
    setSuggestions([]);
    htmlRef.current.focus();
  };

  const insertCssSuggestion = (suggestion) => {
    const textarea = document.getElementById('cssEditor');
    const currentText = textarea.value;
    const newText = currentText + `${suggestion}: ;\n`;
    setCssCode(newText);
    setSuggestions([]);
    textarea.focus();
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 p-4">
      <div className="sm:w-1/2 pr-2 mb-4 sm:mb-0">
        <Card>
          <CardHeader>
            <CardTitle>HTML Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              ref={htmlRef}
              value={htmlCode} 
              onChange={handleHtmlChange}
              className="w-full h-40 p-2 border rounded resize-none"
              placeholder="Type your HTML here..."
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white border p-2 shadow-lg">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} onClick={() => insertSuggestion(suggestion)} className="cursor-pointer hover:bg-gray-200 p-1">
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="sm:w-1/2 pl-2">
        <Card>
          <CardHeader>
            <CardTitle>CSS Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              id="cssEditor"
              value={cssCode} 
              onChange={handleCssChange}
              className="w-full h-40 p-2 border rounded resize-none"
              placeholder="Type your CSS here..."
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white border p-2 shadow-lg">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} onClick={() => insertCssSuggestion(suggestion)} className="cursor-pointer hover:bg-gray-200 p-1">
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border p-2 min-h-[100px]" 
              dangerouslySetInnerHTML={{ __html: `<style>${cssCode}</style>${htmlCode}` }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;