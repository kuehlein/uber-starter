/* eslint-disable no-console */

import chalk from "chalk";

/**
 * Formats and colors logs to the console given a `status` and any number of
 * strings you may wish to pass. NOTE: you can style the input strings (using
 * a library like `chalk`) that you pass in for furthur customization.
 *
 * @param {string} status - `"log" | "warn" | "error"`
 * @param  {...string} text
 */
export const prettyLogger = (status, ...text) => {
  const indent = "             ";
  const designs = {
    error: chalk.reset.redBright(
      "\n#########################################################"
    ),
    log: chalk.reset.cyanBright(
      "\n`·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·´"
    ),
    warn: chalk.reset.yellowBright(
      "\n*********************************************************"
    )
  };
  const colors = {
    error: "redBright",
    log: "cyanBright",
    warn: "yellow"
  };

  const styledText = text.map(sentence =>
    chalk.bold[colors[status]](`\n${indent}${sentence}`)
  );

  console[status](designs[status]);
  console[status](...styledText);
  console[status](`${designs[status]}\n`);
};
