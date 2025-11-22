module.exports = function (req, res, next) {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Teacher access only" });
  }
  next();
};
