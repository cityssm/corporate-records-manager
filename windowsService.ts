import * as path from "path";
import type { ServiceConfig } from "node-windows";

export const serviceConfig: ServiceConfig = {
  name: "Building Permit System",
  description: "A tool to manage building permits, plans examinations, and inspections.",
  script: path.join("bin", "www.js")
};
