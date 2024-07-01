import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ludopediaUrl: string = import.meta.env.VITE_LUDOPEDIA_URL;

const Authorized: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Function to parse query parameters
    const getQueryParam = (param: string) => {
      return new URLSearchParams(location.search).get(param);
    };

    const code = getQueryParam('code');
    if (code) {
      // Execute the POST request with the code
      axios.post(`${ludopediaUrl}/tokenrequest`, { code })
        .then(response => {
          console.log(response.data);
          // Handle the response data here
          if (response.data.error) {
            const { error, error_description } = response.data;
            // Display the error and error description on the page
            return (
              <div>
                <p>Error: {error}</p>
                <p>Error Description: {error_description}</p>
              </div>
            );
          }
          else if (response.data.access_token) {
            // Save the token in local storage
            localStorage.setItem('ludo_token', `${response.data.token_type} ${response.data.access_token}`);

            // Redirect to the home page
            window.location.href = window.location.origin;
          } else {
            return (
              <div>
                <p>Unauthorized</p>
              </div>
            );
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [location]);
  return null;
};

export default Authorized;