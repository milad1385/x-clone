import Validator from "fastest-validator";

const v = new Validator();

const signInSchema = {
  identifier: { type: "string", min: 4, max: 100 },
  password: { type: "string", min: 8, max: 30 },
};

const signUpSchema = {
  username: { type: "string", min: 3 },
  fullName: { type: "string", min: 3, max: 255 },
  email: { type: "string", min: 3, max: 255 },
  password: { type: "string", min: 8, max: 30 },
};

export const checkSignIn = v.compile(signInSchema);

export const checkSignUp = v.compile(signUpSchema);
