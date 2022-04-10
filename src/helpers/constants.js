export const bookingStatus = ["notStarted", "onJourney", "completed"];

export const apiV1Prefix = "/api/v1/";

export const {
  API_KEY,
  DB_HOST,
  DB_NAME,
  DB_PWD,
  DB_USER,
  JWTSecretKey,
  JWTExpiresIn,
  PORT,
  STATIC_FILES_URL,
  TWILIO_ACCOUNT_SID,
  TWILIO_SERVICE_ID,
  TWILIO_AUTH_TOKEN
} = process.env;

export const url = `http://localhost:${PORT}${apiV1Prefix}${API_KEY}`

export const roles = ["user", "admin", "driver", "operator"];
