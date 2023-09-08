/*
 * Filename: popup.js
 * Created Date: Friday, September 9th 2023
 * Author: lucasdo
 * Email: donhudong.2710@gmail.com
 * Copyright (c) 2023 Lucas Do
 */

const spinnerLoading = document.querySelector("div#spinner-loading");
const resultSection = document.querySelector("section#result");
const notFoundSection = document.querySelector("section#not-found");
const searchButton = document.querySelector("button#search-btn");
const inputCodeBox = document.querySelector("input#apartment-code");
const subdivision = document.querySelector("#subdivision");
const apartmentType = document.querySelector("#apartment-type");
const direction = document.querySelector("#direction");
const area = document.querySelector("#area");
const plan1Price = document.querySelector("#plan1-price");
const plan2Price = document.querySelector("#plan2-price");
const plan3Price = document.querySelector("#plan3-price");
const plan4Price = document.querySelector("#plan4-price");

spinnerLoading.hidden = true;
resultSection.hidden = true;
notFoundSection.hidden = true;
chrome.storage.local.get(["apartmentCode"], items => {
    if (items && items.apartmentCode) {
        inputCodeBox.value = items.apartmentCode;
    }
});
searchButton.addEventListener("click", queryApartmennt);

function queryApartmennt() {
    resultSection.hidden = true;
    notFoundSection.hidden = true;
    spinnerLoading.hidden = false;
    const apartmentCode = inputCodeBox.value.trim();
    chrome.storage.local.set({apartmentCode});
    chrome.runtime.sendMessage({
        event: "query-aparment",
        apartmentCode: apartmentCode,
    }, response => {
        try{
            showResult(response.data);
        } catch (err) {
            console.log(response);
            console.log(`Got error ${err}`)
            alertCannotFound();
        }
    });
}

function showResult(result) {
    subdivision.innerHTML = result.subdivision || "No data";
    apartmentType.innerHTML = result.type || "No data";
    direction.innerHTML = result.direction || "No data";
    area.innerHTML = result.navigableArea ? (result.navigableArea + "&nbsp;m<sup>2</sup>") : "No data";
    plan1Price.innerHTML = result.plan1.fullPrice ? (result.plan1.fullPrice + "&nbsp;VND") : "No data";
    plan2Price.innerHTML = result.plan2.fullPrice ? (result.plan2.fullPrice + "&nbsp;VND") : "No data";
    plan3Price.innerHTML = result.plan3.fullPrice ? (result.plan3.fullPrice + "&nbsp;VND") : "No data";
    plan4Price.innerHTML = result.plan4.fullPrice ? (result.plan4.fullPrice + "&nbsp;VND") : "No data";
    resultSection.hidden = false;
    spinnerLoading.hidden = true;
}

function alertCannotFound() {
    notFoundSection.hidden = false;
    spinnerLoading.hidden = true;
}