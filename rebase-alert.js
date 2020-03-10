const v3 = require("node-hue-api").v3;
const colors = require("./colors.json");
const colorConverter = require("./color-converter");

let cie = colorConverter.data.rgb_to_cie(
  colors.rebase.r,
  colors.rebase.g,
  colors.rebase.b
);

const LightState = v3.lightStates.LightState;
const USERNAME = "5k7o8TN2MDCRfxpFXGXXRlVsJRdOo10Mfs1ShA0O",
  // The name of the light we wish to retrieve by name
  LIGHT_ID = 4;
v3.discovery
  .nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Using a LightState object to build the desired state
    const state = new LightState()

      .on(true)
      .xy(cie)
      .brightness(colors.rebase.brightness);

    return api.lights.setLightState(LIGHT_ID, state);
  })
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  });

console.log("rebase works");
