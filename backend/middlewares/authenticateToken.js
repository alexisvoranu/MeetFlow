import admin from "../firebase/firebase-admin.js";

const excludedRoutes = ["/api/v1/participants/getAllParticipants"];

const authenticateToken = async (req, res, next) => {
  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Access Denied");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(403).send("Invalid or expired token");
  }
};

export default authenticateToken;
