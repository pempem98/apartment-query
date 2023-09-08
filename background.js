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
        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {
            gapi.auth.setToken({ "access_token": token });
            gapi.client.sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID
            }).then(response => {
                let sheetTitles = [];
                response.result.sheets.map(sheet => {
                    const title = sheet.properties.title;
                    sheetTitles.push(title);
                });
                gapi.client.sheets.spreadsheets.values.batchGet({
                    spreadsheetId: SPREADSHEET_ID,
                    ranges: sheetTitles,
                }).then(response => {
                    let all_data = [];
                    response.result.valueRanges.map(sheet => {
                        const append_data = sheet.values;
                        all_data.push(...append_data);
                    });
                    all_data.map(row => {
                        if (row.includes(apartmentCode.toUpperCase())) {
                            let entity = new Apartment(row);
                            console.log(entity);
                            callback({ data: entity });
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
