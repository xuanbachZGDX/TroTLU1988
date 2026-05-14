import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
require("dotenv").config();

export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

export const comparePassword = (password, hash) =>
  bcrypt.compareSync(password, hash);
