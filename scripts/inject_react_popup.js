// popup.js

let config_response = null;

// Function to fetch and parse JSON asynchronously
const fetchConfig = async () => {
  try {
    const response = await fetch('../config.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
};

// Function to handle the configuration data
const handleConfig = async () => {
  const config = await fetchConfig();
  if (config) {
    console.log('Configuration:', config);
    // Now you can use the configuration as needed
    config_response = config

    // Wherever the app frontend has been hosted (frontend_site_url_without_trailing_/)
    const HOSTED_SITE = config_response.frontendSiteUrl || "http://localhost:3000";

    const root = document.getElementById("root");
    const iframe = document.createElement("iframe");

    let global_latitude, global_longitude;

    const geolocationErrorHandler = (error) => {
      alert(`ERROR(${error.code}) poopie: ${error.message}`);
    };

    const geolocationHandler = ({ coords }) => {
      if (coords === undefined) {
        console.log("undefined coords");
      } else {
        const { latitude, longitude } = coords;
        if (latitude === undefined || longitude === undefined) {
          console.log("undefined latitude or longitude from coords");
        } else {
          global_latitude = latitude;
          global_longitude = longitude;

          createIframe();
        }
      }
    };

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
    } else {
      navigator.geolocation.getCurrentPosition(
        geolocationHandler,
        geolocationErrorHandler
      );
    }

    const createIframe = () => {
      console.log(`latitude=${global_latitude} longitude=${global_longitude}`);

      iframe.src = `${HOSTED_SITE}/Login?latitude=${global_latitude}&longitude=${global_longitude}`;
      iframe.allow = "geolocation *;";
      iframe.style.border = "none";
      iframe.style.margin = "0";
      iframe.style.padding = "0";
      iframe.style.display = "block";
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      root.appendChild(iframe);
    };


  } else {
    console.error('Failed to fetch configuration.');
  }
};

// Call the function to handle the configuration
handleConfig();