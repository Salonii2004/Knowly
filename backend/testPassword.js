import bcrypt from "bcrypt";
import { User } from "./src/models/User.js"; // <-- corrected path
import { sequelize } from "./src/config/database.js";

const test = async () => {
  try {
    await sequelize.authenticate(); // ensure DB connection

    const email = "patelumesh181070@gmail.com";
    const password = "$2b$10$C/iqOx/ReaI3w58dkw7HHO66pukFus00Y8FS0n9F2yxWFbcb3QsRu"; // the password you set in reset
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User not found");
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid?", isValid);
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
};

test();
