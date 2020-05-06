'use strict';

const { Router } = require('express');
const router = new Router();

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { googleSheets } = require('../googleSheets/googleSheets');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = 'token.json';

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return console.log(err);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

const jason = [];

const sheetName = 'PRT';
const firstCollumn = 'A';
const lastCollumn = 'C';

function listFactories(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: '17do_O4M8sssfOz1WD3bBhqXMmoFqVEMoiVGzghaIDBw',
      range: `${sheetName}!${firstCollumn}:${lastCollumn}`,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;

      if (rows.length) {
        rows.map((row, i, arr) => {
          let obj = {};
          if (i !== 0) {
            for (let z = 0; z < row.length; z++) {
              obj[arr[0][z]] = row[z];
            }
          }
          if (i !== 0) {
            jason.push(obj);
          }
        });
      } else {
        console.log('No data found.');
      }
      return jason;
    }
  );
}
router.get('/', (req, res, next) => {
  res.json({ beerFactory: 'all the beers' });
});

router.get('/PRT', (req, res, next) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listFactories);
  });
  res.json(jason);
});

module.exports = router;
