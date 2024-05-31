import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = (data, res) => {
  const token = jwt.sign({ ...data }, process.env.ACCESS_TOKEN, {
    expiresIn: "15d",
  });

  res.cookie("accessToken", token, {
    maxAge: 1296000,
    httpOnly: true,
    path: "/",
  });
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const verifyPassword = async (pass, hashedPass) => {
  const isValid = await bcrypt.compare(pass, hashedPass);

  return isValid;
};

export {
  generateAccessToken,
  verifyAccessToken,
  hashedPassword,
  verifyPassword,
};
