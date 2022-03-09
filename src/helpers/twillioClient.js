import twilio from "twilio"
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "./constants";

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;

export default twilio(accountSid, authToken);


