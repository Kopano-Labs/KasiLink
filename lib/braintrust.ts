import * as aiSdk from "ai";
import { initLogger, wrapAISDK } from "braintrust";

const projectName = "KasiLink";
const apiKey =
  process.env.BRAINTRUST_API_KEY || process.env.NEXT_PUBLIC_BRAINTRUST_API_KEY;

export const braintrustEnabled = Boolean(apiKey);

export const braintrustLogger = braintrustEnabled
  ? initLogger({
      apiKey,
      projectId: process.env.BRAINTRUST_PROJECT_ID,
      projectName,
      setCurrent: true,
    })
  : null;

export const braintrustAI = wrapAISDK(aiSdk);
