/*
 * Filename: background.js
 * Created Date: Friday, September 8th 2023
 * Author: lucasdo
 * Email: donhudong.2710@gmail.com
 * Copyright (c) 2023 Lucas Do
 */

// Constants
const API_KEY = "AIzaSyDhmMoaY4m9lsEAnA8rVlckkoayDpns664";
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SPREADSHEET_ID = "1oiA2ADV-3tjbxbeEBkk0594liD1GUdfooEBjmwcaOyw";

// Initialize client
function onGAPILoad() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,

    }).then(function() {
        console.log("GAPI Client initialized")
    }, function(error) {
        console.log("error", error)
    });
}

// Listent to request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && (message.event === "query-aparment")) {
        processQueryApartment(message.apartmentCode, sendResponse);
        return true;
    }
});

// Get the data from sheets
async function processQueryApartment(apartmentCode, callback) {
    console.log(`Query apartment: ${apartmentCode}`);
    try {
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        }).then(response => {
            let sheetsInfo = new Map();
            response.result.sheets.map(sheet => {
                const title = sheet.properties.title;
                const gid = sheet.properties.sheetId;
                sheetsInfo.set(title, gid);
            });
            gapi.client.sheets.spreadsheets.values.batchGet({
                spreadsheetId: SPREADSHEET_ID,
                ranges: Array.from(sheetsInfo.keys()),
            }).then(response => {
                response.result.valueRanges.map(sheetData => {
                    let rowNumber = 0;
                    sheetData.values.map(row => {
                        rowNumber++;
                        if (row.includes(apartmentCode.toUpperCase())) {
                            const sheetTitle = /(?<=\').*?(?=\')/.exec(sheetData.range)[0];
                            const sheetId = sheetsInfo.get(sheetTitle);
                            const refUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/#gid=${sheetId}&range=A${rowNumber}`;
                            const entity = {
                                data: new Apartment(row),
                                refUrl: refUrl
                            };
                            console.log(entity);
                            callback(entity);
                            return;
                        }
                    });
                });
            });
        });
    } catch(err) {
        console.warn(`Got error: ${err}`);
        callback(null);
    }
}
