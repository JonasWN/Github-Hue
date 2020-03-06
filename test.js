const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;
const USERNAME = "01VG3P0cqnyXEXhiUSSmYRpGXG9Xwfn6Bxlhnwvn",
  // The name of the light we wish to retrieve by name
  LIGHT_ID = 13;
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
      .ct(200)
      .brightness(50)
      .hue(30000);
    return api.lights.setLightState(LIGHT_ID, state);
  })
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  });
