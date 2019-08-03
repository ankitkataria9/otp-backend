const express = require('express');
const router = express.Router();
const otpQuery = require('../db_stuff/otp.mysql');

router.post('/generate', async function (req, res) {
  try {
    console.log(req.body)
    const mobile = req.body.mobile;
    if (!mobile) throw new Error("Mobile number must be a 10 digit number.");
    if (isNaN(mobile)) throw new Error("Mobile number must be in numeric.");
    if (mobile.toString().length !== 10) throw new Error("Mobile number must contain 10 digits.");

    otpQuery.verifyMobile(mobile, (err, rows, fields) => {
      try {
        if (err) throw err
        if (rows.length === 0) {
          otpQuery.generateOtp(mobile, (err, rows, fileds) => {
            try {
              if (err) throw err

              res.json({ status: 1, isOtpResend: false })
            }
            catch (error) {
              return res.json({ status: 0, error: error.message })
            }
          })
        } else {
          otpQuery.incrementOtpCount(mobile, function (err) {
            if (err) return res.json({ status: 0, error: err.message });
            res.json({ status: 1,  isOtpResend: true })
          })
        }
      }
      catch (error) {
        return res.json({ status: 0, error: error.message })
      }
    })

  }
  catch (error) {
    return res.json({ status: 0, error: error.message })
  }
});

router.post("/verify-otp", function (req, res) {
  try {
    const mobile = req.body.mobile;
    const otp = req.body.otp;
    if (!mobile) throw new Error("Mobile number must be a 10 digit number.");
    if (isNaN(mobile)) throw new Error("Mobile number must be in numeric.");
    if (mobile.toString().length !== 10) throw new Error("Mobile number must contain 10 digits.");

    if (!otp) throw new Error("Otp must be a 6 digit number.");
    if (isNaN(otp)) throw new Error("Otp must be in numeric.");
    if (otp.toString().length !== 6) throw new Error("Otp must contain 6 digits.");

    otpQuery.verifyOtp(mobile, otp, function (err, rows) {
      try {
        if (err) throw error;
        if (rows.length > 0) {
          return res.json({ status: 1, message: "otp matched" })
        } else {
          return res.json({ status: 0, error: "otp not matched" })
        }

      }
      catch (error) {
        return res.json({ status: 0, error: error.message })

      }
    })
  }
  catch (error) {
    return res.json({ status: 0, error: error.message })
  }
})

module.exports = router;