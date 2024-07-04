import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Partidas from './Partidas'

const authorizedUrl: string = import.meta.env.VITE_CALLBACK_URL;
const ludopediaUrl: string = import.meta.env.VITE_LUDOPEDIA_URL;
const usuarios_grupo = ['Raphael Moura', 'Andrerocha88', 'BLT_Padre', 'lucas_faial', 'albomonaco', 'romanoludo'];

const App: React.FC = () => {
  // State to track if the token exists
  const [hasToken, setHasToken] = useState<string>('');
  const [usuario, setUsuario] = useState<string>('');
  const [error, setError] = useState<string>('');

  const authorize = () => {
      // Encode the following url with encodeURIComponent
      const redirectUri = encodeURIComponent(authorizedUrl);
      const appId = '414d23bb9d22608d'

      window.location.href = `https://ludopedia.com.br/oauth?app_id=${appId}&redirect_uri=${redirectUri}`;    
  }

  useEffect(() => {
    if (error) return;

    // Function to parse query parameters
    const getQueryParam = (param: string) => {
      return new URLSearchParams(location.search).get(param);
    };

    const code = getQueryParam('code');
    if (code) {
      // Execute the POST request with the code
      axios.post(`${ludopediaUrl}/tokenrequest`, { code }, {
        headers: {
          Origin: window.location.origin
        }
      })
        .then(response => {
          console.log(response.data);
          // Handle the response data here
          if (response.data.error) {
            setError(response.data.error_description);
          }
          else if (response.data.access_token) {
            // Save the token in local storage
            localStorage.setItem('ludo_token', `${response.data.token_type} ${response.data.access_token}`);

            // Redirect to the home page
            window.location.href = window.location.origin;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });

        return;
    }
    
    const token = localStorage.getItem('ludo_token');
    if (!token) {
      // Redirect after a short delay to allow the state update to render
      authorize();
    } else {

      axios.get(`${ludopediaUrl}/api/v1/me`, {
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          const usuario = response.data.usuario;
          if (!usuarios_grupo.includes(usuario)) {
            setHasToken('')
          } else {
            // Handle successful response
            setHasToken(token);
            setUsuario(usuario)
          }
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
  }, [error, hasToken]);

  // Conditionally render content based on the token's presence
  if (!hasToken) {
    return <div>Unauthorized...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Partidas usuario={usuario} token={hasToken} />
  );
};

export default App;