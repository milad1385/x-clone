import Validator from "fastest-validator";

const v = new Validator();

const userSchema = {
  username: { type: "string", min: 3 },
  fullName: { type: "string", min: 3, max: 255 },
  email: { type: "string", min: 3, max: 255 },
  currPassword: { type: "string", min: 8, max: 30, optional: true },
  newPassword: { type: "string", min: 8, max: 30, optional: true },
  bio: { type: "string", min: 3, max: 500 },
  link: { type: "string", min: 3, max: 100 },
};

export const checkUser = v.compile(userSchema);
