var functions = {};
functions.hex_to_cie = function hex_to_cie(hex_color) {
  let pure_hex = hex_color.replace(/^(#)/gi, "");
  let rgb_int = parseInt(pure_hex, 16);
  let red = (rgb_int >> 16) & 0xff;
  let green = (rgb_int >> 8) & 0xff;
  let blue = rgb_int & 0xff;
  return rgb_to_cie(red, green, blue);
};

functions.cie_to_rgb = function cie_to_rgb(x, y, brightness) {
  //Set to maximum brightness if no custom value was given (Not the slick ECMAScript 6 way for compatibility reasons)
  if (brightness === undefined) {
    brightness = 254;
  }

  var z = 1.0 - x - y;
  var Y = (brightness / 254).toFixed(2);
  var X = (Y / y) * x;
  var Z = (Y / y) * z;

  //Convert to RGB using Wide RGB D65 conversion
  var red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
  var green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
  var blue = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

  //If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
  if (red > blue && red > green && red > 1.0) {
    green = green / red;
    blue = blue / red;
    red = 1.0;
  } else if (green > blue && green > red && green > 1.0) {
    red = red / green;
    blue = blue / green;
    green = 1.0;
  } else if (blue > red && blue > green && blue > 1.0) {
    red = red / blue;
    green = green / blue;
    blue = 1.0;
  }

  //Reverse gamma correction
  red =
    red <= 0.0031308
      ? 12.92 * red
      : (1.0 + 0.055) * Math.pow(red, 1.0 / 2.4) - 0.055;
  green =
    green <= 0.0031308
      ? 12.92 * green
      : (1.0 + 0.055) * Math.pow(green, 1.0 / 2.4) - 0.055;
  blue =
    blue <= 0.0031308
      ? 12.92 * blue
      : (1.0 + 0.055) * Math.pow(blue, 1.0 / 2.4) - 0.055;

  //Convert normalized decimal to decimal
  red = Math.round(red * 255);
  green = Math.round(green * 255);
  blue = Math.round(blue * 255);

  if (isNaN(red)) red = 0;

  if (isNaN(green)) green = 0;

  if (isNaN(blue)) blue = 0;

  return [red, green, blue];
}

/**
 * Converts RGB color space to CIE color space
 * @param {Number} red
 * @param {Number} green
 * @param {Number} blue
 * @return {Array} Array that contains the CIE color values for x and y
 */

functions.rgb_to_cie = function rgb_to_cie(red, green, blue) {
  //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
  var red =
    red > 0.04045 ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : red / 12.92;
  var green =
    green > 0.04045
      ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4)
      : green / 12.92;
  var blue =
    blue > 0.04045
      ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4)
      : blue / 12.92;

  //RGB values to XYZ using the Wide RGB D65 conversion formula
  var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  var Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;

  //Calculate the xy values from the XYZ values
  var x = (X / (X + Y + Z)).toFixed(4);
  var y = (Y / (X + Y + Z)).toFixed(4);

  if (isNaN(x)) x = 0;

  if (isNaN(y)) y = 0;

  return [parseFloat(x), parseFloat(y)];
}

exports.data = functions;
