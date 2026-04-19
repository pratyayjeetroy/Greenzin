import express from "express";
import { register, login, send_otp, verify_otp, verifyUser, logout,contactDetails} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/register", register);
app.post("/login", login);
app.post("/send_otp", send_otp);
app.post("/verify_otp", verify_otp);
app.post("/contact", contactDetails);

app.use(isAuthenticated);

app.use('/verifyUser', verifyUser);
app.get("/logout", logout);

export default app;