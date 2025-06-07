import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("/auth/send-otp", { mobile });
      setMessage(res.data);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data || "Error sending OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post("/auth/reset-password", {
        mobile,
        otp,
        newPassword,
      });
      setMessage(res.data);
      setStep(3); // done
    } catch (err) {
      setMessage(err.response?.data || "Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <input
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Reset Password</h2>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            placeholder="Enter New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset</button>
        </>
      )}

      {step === 3 && <h3>{message}</h3>}

      {message && <p>{message}</p>}
    </div>
  );
}
