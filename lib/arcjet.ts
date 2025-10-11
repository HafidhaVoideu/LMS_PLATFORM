import { env } from "./env";

import "server-only";
// import {shield, slidingWindoe} from "@arjet/next";
import arcjet, {
  detectBot,
  shield,
  slidingWindow,
  protectSignup,
  sensitiveInfo,
  fixedWindow,
} from "@arcjet/next";
export {
  detectBot,
  shield,
  slidingWindow,
  protectSignup,
  fixedWindow,
  sensitiveInfo,
};

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],

  rules: [shield({ mode: "LIVE" })],
});
