# SyncSalat

SyncSalat is a Google Chrome extension designed to assist Muslims in managing their daily prayers effectively. Whether you're trying to stay on top of your own prayer schedule or coordinate with friends and family, SyncSalat provides timely reminders and tools to help you stay focused on your spiritual practice.

## Features

- **Prayer Reminders**: Receive notifications 5 minutes before each prayer time to prepare for prayer.
- **Post-Prayer Check-ins**: Get reminders 5 minutes after each prayer to ensure you've completed your prayer.
- **Poke and Remind**: Send gentle reminders to friends and family to encourage them to pray.
- **Countdown Timer**: View the time remaining until the next prayer directly within the extension.
- **Chrome Dialog Alerts**: Receive dialogue alerts within Chrome, prompting you to pause and take a break for prayer.

## Why SyncSalat?

SyncSalat was created to simplify the management of daily prayers for Muslims. Realizing that alot of times, prayers were close to missing / completely missed due to being preoccupied in work or entertainment on your laptops, by leveraging browser extensions, SyncSalat aims to make it easier for individuals and communities to stay connected to their spiritual practices, ensuring that prayers are not missed or forgotten amidst the hustle and bustle of daily life.

## Feature Showcase

<p align="center"><img src="https://github.com/not-shoyo/SyncSalat/assets/73631606/12895e75-e99c-4724-ad17-77b80d9e40f6" /></p>
<ul>
  <li>Login Page with Unique Username and Password Combination</li>
  <li>Extension stores the previously signed in user unless explicitly logged out</li>
</ul>

<p align="center"><img src="https://github.com/not-shoyo/SyncSalat/assets/73631606/a2e8eb92-3f44-4d9c-8698-bc1783df4438" /></p>
<ul>
  <li>Main Page of the Extension-Application</li>
  <li>Displays how much time is left for the next prayer, based on User Location</li>
  <li>Shows Information of previous prayers of both User and all of User's friends, along with their stats and an option to remind friends to pray</li>
  <ul>
    <li>The two buttons beside every prayer is used to remind that friend about that particular prayer</li>
    <li>The Users own name-tab serves the purpose of logging out as well</li>
  </ul>
  <li>Includes an action button in the bottom to record a prayer</li>
</ul>

<p align="center"><img src="https://github.com/not-shoyo/SyncSalat/assets/73631606/42af2b99-b0ed-4f0a-9e3c-ffb8eb234f1b" /></p>
<ul>
  <li>When poked by another user, an alert pops up on your browser screen reminding current user to pray.</li>
  <ul>
    <li>A user can only poke a friend twice for a particular prayer, so as to prevent spamming</li>
  </ul>
</ul>

## Installation

To install SyncSalat, follow these simple steps:

1. Open Google Chrome.
2. Navigate to the Chrome Web Store.
3. Search for "SyncSalat".
4. Click on the "Add to Chrome" button.
5. Confirm the installation.
6. SyncSalat will now be added to your Chrome extensions.

<br/><br/>
**To Develop / Run Locally:**

1. Pull the Repo (after forking and cloning if required) into your local system.
2. Create "config.json" in root directory with `frontendSiteUrl` property set to required Url.
3. Change "client/package.json" `homepage` property to required Url.
5. Provide SSL Private Key and Certificate files as localhost-key.pem & localhost-cert.pem respectively, needed for HTTPS server.
6. There are a myriad of environment variables that can be set and modified as per development specifics as well:
   * `PORT` (for server)
   * `FRONTEND_URL`
   * `DB_USERNAME`
   * `DB_PASSWORD`
   * `DB_URL` (no need for USERNAME and PASSWORD if URL is provided)
   * `PATH_TO_SECRETS`
   * `SSL_PRIVATE_KEY`
   * `SSL_CERTIFICATE`
   * `BACKEND_URL` (for client)
   * `REACT_APP_BACKEND_URL` (no need for BACKEND_URL if REACT_APP_BACKEND_URL is provided)
7. Move into client directory and run `npm run start` (might need to change the `homepage` in package.json) & move into server directory and run `npx nodemon run main`.

## Tech Stack

SyncSalat is built using standard web technologies and Chrome extension APIs. The following technologies are used in its development:

- **HTML/CSS/JavaScript**: For building the user interface and handling interactions.
- **Chrome Extension APIs**: For integrating with Chrome's notification system, dialogue alerts & accessing geo-location data.
- **Frontend**: React is the Frontend Framework used to render and handle dynamic changes in the application.
- **Backend**: Backend server is implemented for some application logic as well features like user accounts and data synchronization. Node.js servers are spit up and websockets are used for alerting between users.
- **Database**: MongoDB is used as a document centric database, possible to run locally or on the cloud via atlas.

## Contributing

SyncSalat is a personal project now turned an open-source project, and contributions definitely are welcome! If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request. Bug reports and feature requests can be submitted via the project's GitHub issues page.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute SyncSalat according to the terms of this license.

## Contact

Have questions or feedback? Reach out to the project maintainer via email at [akheelsaajid@gmail.com](mailto:akheelsaajid@gmail.com).

Thank you for using SyncSalat! Hope it helps you and your loved ones stay connected to your prayers and spirituality.
