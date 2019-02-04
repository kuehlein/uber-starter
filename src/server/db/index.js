'use strict'

import { default as db } from "./_db";

// register models
import "./models";

export default db;
export * from "./models";
