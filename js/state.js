const seform = document.getElementById("sform");
const cityinput = document.getElementById("cityinput");
const searchbtn = document.getElementById("searchbtn");
const weathersection = document.getElementById("weather");
const statusbox = document.getElementById("status");
const refreshbtn = document.getElementById("refreshbtn");
const lastupdated = document.getElementById("lastupdated");
const locatebtn = document.getElementById("locatebtn");
const favouriteslist = document.getElementById("favouriteslist");
const favouritebtn = document.getElementById("favouritebtn");

let currentloc = null;
let requestid = 0; // guards against stale responses overwriting newer ones
const HOURS_SHOWN = 8;
const FAVOURITES_KEY = "favourite-cities";
const CACHE_KEY = "cached-weather-data";
const CACHE_DUE = 10 * 60 * 1000;
