import { HexChannel, HexColorStr, WCAGStandard, WCAGRatios } from "./types";

const RED_WEIGHT: number = 0.2126;
const GREEN_WEIGHT: number = 0.7152;
const BLUE_WEIGHT: number = 0.0722;
const REFLECTIVITY: number = 0.05;
const ε: number = 0.01;

export const channelWeights = [ RED_WEIGHT, GREEN_WEIGHT, BLUE_WEIGHT ];

export const WCAGcontrastRatios: WCAGRatios = {
  "AA": 3,
  "AA_text": 4.5,
  "AA_text_large": 3,
  "AAA_text": 7,
  "AAA_text_large": 4.5,
}

const hexToHSL = (H: HexColorStr): number[] => {
  // Convert hex to RGB first
  let r = parseInt("0x" + H[1] + H[2], 16) / 255;
  let g = parseInt("0x" + H[3] + H[4], 16) / 255;
  let b = parseInt("0x" + H[5] + H[6], 16) / 255;

  // Then to HSL
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

const HSLToHex = (h: number, s: number, l: number): HexColorStr => {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0, 
      b = 0; 

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  let rs = Math.round((r + m) * 255).toString(16);
  let gs = Math.round((g + m) * 255).toString(16);
  let bs = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (rs.length == 1)
    rs = "0" + rs;
  if (gs.length == 1)
    gs = "0" + gs;
  if (bs.length == 1)
    bs = "0" + bs;

  return ("#" + rs + gs + bs) as HexColorStr;
}

export const channelsToHex = (R: HexChannel, G: HexChannel, B: HexChannel): HexColorStr => (
  '#' +
  (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)
) as HexColorStr;

export const hexChannels = (color: HexColorStr): HexChannel[] => {
  return [
    parseInt(color.slice(1, 3), 16) as HexChannel,
    parseInt(color.slice(3, 5), 16) as HexChannel,
    parseInt(color.slice(-2), 16) as HexChannel,
  ]
}

export const linearizedRGB = (sRGB: HexChannel): number => {
  return sRGB / 255 <= 0.04045 ?
    sRGB / 255 / 12.92 :
    Math.pow(((sRGB / 255) + 0.055) / 1.055, 2.4);
};

export const relativeLuminance = (color: HexColorStr) => {
  const [R, G, B] = hexChannels(color);
  return (
    RED_WEIGHT * linearizedRGB(R) +
    GREEN_WEIGHT * linearizedRGB(G) +
    BLUE_WEIGHT * linearizedRGB(B)
  );
};

export const contrastRatio = (lumA: number, lumB: number): number => {
  return lumA > lumB ? (lumA + REFLECTIVITY) / (lumB + REFLECTIVITY) : (lumB + REFLECTIVITY) / (lumA + REFLECTIVITY);
}

export const desiredLuminance = (lumA: number, desiredContrastRatio: number): number => {
    return ((lumA + REFLECTIVITY) * desiredContrastRatio) - REFLECTIVITY > 1 ? 
      ((lumA + REFLECTIVITY) / desiredContrastRatio) - REFLECTIVITY:
      ((lumA + REFLECTIVITY) * desiredContrastRatio) - REFLECTIVITY;
  }

export const makeHexesContrast = (color: HexColorStr, fixedColor: HexColorStr, minContrastRatio: WCAGStandard | number = "AA_text") => {
  if (typeof color !== "string" || !/#[0-9a-f]{6}$/i.test(color)) {
    console.warn(`${color} is not a hexcode, please provide a hexcode`);
    return null;
  }
  if (typeof fixedColor !== "string" || !/#[0-9a-f]{6}$/i.test(fixedColor)) {
    console.warn(`${fixedColor} is not a hexcode, please provide a hexcode`);
    return null;
  }

  const desiredContrastRatio = typeof minContrastRatio === "number" ? minContrastRatio : WCAGcontrastRatios[minContrastRatio];
  const relativeLumA = relativeLuminance(fixedColor);
  const greatestContrastRatio = Math.max(contrastRatio(relativeLumA, 0), contrastRatio(relativeLumA, 1));
  if (greatestContrastRatio < desiredContrastRatio) return null;
  
  const targetLuminance = desiredLuminance(relativeLumA, desiredContrastRatio);
  let [h, s, l] = hexToHSL(color);
  const relativeLumB = (lightness = l): number => relativeLuminance(HSLToHex(h, s, lightness));
  const contrastNearEnough = (): boolean => contrastRatio(relativeLumB(l), relativeLumA) < desiredContrastRatio ||
    contrastRatio(relativeLumB(targetLuminance > relativeLumA ? Math.floor(l) : Math.ceil(l)), relativeLumA) > desiredContrastRatio;

  let lRange = targetLuminance < relativeLumA ? l : 100 - l;
  while (lRange > ε && contrastNearEnough()) {
    if (relativeLumB() < targetLuminance) {
      l += lRange/2;
    } else if (relativeLumB() > targetLuminance) {
      l -= lRange/2;
    }
    lRange /= 2;
  }

  return HSLToHex(h, s, targetLuminance < relativeLumA ? Math.floor(l) : Math.ceil(l));
}

export const getContrastingHex = (color: HexColorStr, minContrastRatio: WCAGStandard | number = "AA_text") => {
  return makeHexesContrast(color, color, minContrastRatio);
}