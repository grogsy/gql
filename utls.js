const jwt = require("jsonwebtoken");
const APP_SECRET = "super_secret";

function getUserId(context) {
  const Auth = context.request.get("Authorization");
  if (Auth) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }
}

module_exports = {
  APP_SECRET
};
