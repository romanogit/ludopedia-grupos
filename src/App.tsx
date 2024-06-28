import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Partidas from './Partidas'

const App: React.FC = () => {
  // State to track if the token exists
  const [hasToken, setHasToken] = useState<string>('');

  const authorize = () => {
      // Encode the following url with encodeURIComponent
      const redirectUri = encodeURIComponent('https://localhost:5173/authorized');
      const appId = '414d23bb9d22608d'

      window.location.href = `https://ludopedia.com.br/oauth?app_id=${appId}&redirect_uri=${redirectUri}`;    
  }

  useEffect(() => {
    const token = localStorage.getItem('ludo_token');
    if (!token) {
      setHasToken(''); // Update state to indicate no token
      // Redirect after a short delay to allow the state update to render
      authorize();
    } else {

      axios.get('http://localhost:3000/api/v1/me', {
        headers: {
          Authorization: token
        }
      })
        .then(() => {
          // Handle successful response
          setHasToken(token);
        })
        .catch(error => {
          if (error.response && error.response.status === 403) {
            // Redirect after a short delay to allow the state update to render
            authorize();
          } else {
            // Handle other errors
            console.error(error);
          }
        });
    }
  }, []);

  // Conditionally render content based on the token's presence
  if (!hasToken) {
    return <div>Validating token...</div>; // Temporary content before redirect
  }

  return (
    <Partidas token={hasToken} />
  );
};

export default App;