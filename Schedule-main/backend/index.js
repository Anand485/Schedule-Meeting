const dotenv = require('dotenv');
const express = require('express');
const process = require('process');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const {calculateEmptySlots,bookMeeting} = require('./utils/g_cal.js');

const utils = require('./utils/g_cal.js');
const { time, log } = require('console');

dotenv.config({});

const app = express()

app.set('view engine', 'ejs');

const scopes = ['https://www.googleapis.com/auth/calendar'];
const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline
    scope: scopes // If you only need one scope you can pass it as a string
  });
  res.redirect(url);
})

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // You can store the tokens for future use, e.g. to refresh the access token
    console.log('Access token:', tokens.access_token);
    console.log('Refresh token:', tokens.refresh_token);
    res.send('Authendication Succesfull');
    // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // const events = await calendar.events.list({
    //   calendarId: 'primary',
    //   timeMin: new Date(2024-01-20),
    //   timeMax: endDateTime,
    //   singleEvents: true,
    //   orderBy: 'startTime',
    // });
    // const eventList = events.data.items[0];
  } catch (error) {
    console.error('Error retrieving access token:', error.message);
    res.status(500).send('Error retrieving access token');
  }
})


app.get('/AvailableTime', async (req, res) => {
  let { startTime, endTime, timezone, meetingDuration } = req.query;
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  // const startDateTime = utils.convertToUTC(startTime, timezone);
  // const endDateTime = utils.convertToUTC(endTime, timezone);
  console.log(startTime)
  console.log(endTime)
  console.log(timezone)
  const startDateTime = utils.changeInTimeZone(startTime, timezone);
  const endDateTime = utils.changeInTimeZone(endTime, timezone);
  console.log("starttime", startDateTime)
  console.log("endtime", endDateTime)
  console.log(startDateTime.toISOString());
  // Use the Google Calendar API to get the events for the specified date
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startDateTime.toISOString(),
    timeMax: endDateTime.toISOString(),
    singleEvents: true,
    timeZone: "Asia/Kolkata",
    orderBy: 'startTime',
  });
  console.log(events.data.items);
  // Calculate the empty time slots based on the events
  const emptySlots = utils.calculateEmptySlots(startDateTime, endDateTime, events.data.items, meetingDuration);
  res.json(emptySlots);
});


app.get('/getslots', async (req, res) => {
  const date = req.query.date;
  const start = req.query.start;
  const end = req.query.end;

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: `${date}T${start}:00Z`,
      timeMax: `${date}T${end}:00Z`,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(events.data.items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});


app.get('/getemptyslot', async (req, res) => {
  const { startTime, endTime, timezone, meetingDuration } = req.query;

  // Convert startTime and endTime to JavaScript Date objects
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  try {
      // Fetch events from the Google Calendar API (you may need to adjust this based on your actual implementation)
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const events = await calendar.events.list({
          calendarId: 'primary',
          timeMin: startDateTime.toISOString(),
          timeMax: endDateTime.toISOString(),
          singleEvents: true,
          timeZone: timezone,
          orderBy: 'startTime',
      });

      // Calculate and get the empty slots using the calculateEmptySlots function
      const emptySlots = calculateEmptySlots(startDateTime, endDateTime, events.data.items, parseInt(meetingDuration));

      // Respond with the empty slots as JSON
      res.json(emptySlots);
  } catch (error) {
      console.error('Error fetching events:', error.message);
      res.status(500).send('Error fetching events');
  }
});

app.get('/bookmeeting', (req, res) => {
  const { summary, startDateTime, endDateTime } = req.query;
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    'summary': summary || 'Default Summary',
    'start': {
      'dateTime': startDateTime
    },
    'end': {
      'dateTime': endDateTime
    }
  };

  calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      res.status(500).send('Error creating event');
      return;
    }
    console.log('Event created: %s', event);
    res.json(event);
  });
});





const PORT = process.env.NODE_ENV || 8000;
app.listen(PORT, () => {
  console.log("Server is running on port 8000")
})



