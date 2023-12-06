import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'; // Temporarily reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onFormSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    axios.post('http://localhost:5000/process-file/', formData)
      .then(response => {
        setResponse(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const onFileChange = e => {
    setFile(e.target.files[0]);
  };

  const onPromptChange = e => {
    setPrompt(e.target.value);
  };

  const downloadJsonFile = (data, filename = 'response.json') => {
    // Stringify the JSON data with indentation for formatting
    // const jsonData = JSON.stringify(data, null, 2);
    // Create a new Blob with the stringified JSON data
    const blob = new Blob([response], { type: 'application/json' });

    // Everything else remains the same
    const url = URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = filename;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(url);
  };



  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333', fontSize: "40px" }}>Form Extraction</h1>
      <form onSubmit={onFormSubmit} style={{ maxWidth: '50%', margin: 'auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: "center" }}>
          <input type="file" onChange={onFileChange} accept="image/*, application/pdf" required style={{ width: "100%", padding: '10px', border: '1px solid #ddd', borderRadius: '16px' }} />
          <textarea ref={textareaRef} value={prompt} onInput={adjustHeight} onChange={onPromptChange} style={{ width: "100%", padding: '10px', border: '1px solid #ddd', borderRadius: '16px', resize: 'vertical' }} />
          <button type="submit" disabled={isLoading} style={{ width: "30%", alignItems: "center", backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {response && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h2>Response</h2>
            <pre style={{ background: '#f4f4f4', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', overflowX: 'auto' }}>{response}</pre>
            <button onClick={() => downloadJsonFile(response)} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              Download JSON
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
