import path from "path";
import type { ServiceConfig } from "node-windows";

export const serviceConfig: ServiceConfig = {
  name: "Corporate Records Manager",
  description: "A system for tracking various corporate records administered by the City Clerks Department.",
  script: path.join("bin", "www.js")
};
