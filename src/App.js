import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [postData, setPostData] = useState('');
  const [response, setResponse] = useState('');

  // Fetch message from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/message`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Error fetching message:', err));
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/api/send-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: postData }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.status))
      .catch((err) => console.error('Error sending data:', err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend Application Trourest1!!</h1>
        <p>Message from backend: {message}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={postData}
            onChange={(e) => setPostData(e.target.value)}
            placeholder="Enter some data"
          />
          <button type="submit">Send Data</button>
        </form>
        {response && <p>Response from backend: {response}</p>}
      </header>
    </div>
  );
}

export default App;
