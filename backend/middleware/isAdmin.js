export const isAdmin = async (req, res, next) => {
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res
      .status(403)
      .json({ msg: "this route is accessible just for admin" });
  }

  next();
};
