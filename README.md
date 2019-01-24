Drip Email Uploader
===

A super-simple utility created with [Create React App](https://github.com/facebookincubator/create-react-app) for uploading an arbirary number of email addresses to an email service provider (ESP) over an arbitrary period of time.

The user provides the app with a csv file of email addresses, credentials for the selected ESP, and a number of minutes over which to upload. The app then uploads all addresses via the ESP's API, with a unique delay between each API call to simulate a "human" rate of address submission. Although the delay between each submission is unqiue, the total will _average_ to the user-specified time period.