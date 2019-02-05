/* eslint-disable no-console */

import { internet, name, random } from "faker";

import doggie from "./doggie";
import { prettyLogger } from "../src/server/utils";
import { User } from "../src/server/db";

/**
 * Seeds the database with `process.env.SEED_NUM` random users and addresses.
 */
const seed = async () => {
  // ! change to sequelize
  const db = getConnection();
  if (db.isConnected === false) {
    await db.connect().catch(err => console.log(err));
  }

  createUsers(db, Number(process.env.SEED_NUM));

  prettyLogger("log", ...doggie(`Seeded ${process.env.SEED_NUM} users!`));

  return db;
};

/**
 * Creates `num` of new `user`s with associated `address`es,
 * bulk creates the users, then addresses.
 */
const createUsers = async (db, num) => {
  const users = [];

  for (let i = num; i > 0; i--) {
    const newUser = buildUser();
    users.push(newUser);
  }

  await db
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(users)
    .execute()
    .catch(err => console.log(err));
};

/**
 * Build a `user` using fake data.
 */
const buildUser = () => {
  const newUser = new User();

  newUser.avatar = internet.avatar();
  newUser.firstName = name.firstName();
  newUser.email = `${newUser.firstName}${
    random.uuid().split("-")[0]
  }@${internet.domainName()}`;
  newUser.password = internet.password();

  return newUser;
};

/**
 * Invokes the `seed` function, handles errors and logs output.
 */
const runSeed = async () => {
  let db;

  console.log("seeding...");

  try {
    db = await seed();

    console.log("Closing db connection...");
    await db.close();
    console.log("Db connection closed.");
  } catch (err) {
    console.log(err);
    // ! vvv not properly logging
    // prettyLogger("error", "\n" + JSON.stringify(err, null, 2));

    process.exitCode = 1;
  }
};

// Execute the `seed` function if we ran from the terminal (`npm run seed`).
if (module === require.main) {
  runSeed();
}

// export for testing purposes (see `./seed.spec.ts`)
export default seed;
