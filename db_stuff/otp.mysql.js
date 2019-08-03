const { getConnection } = require('./connections');

module.exports = {
  generateOtp: function (mobile, callback) {
    try {
      getConnection((err, con) => {
        if (err) return callback(err, null, null);
        con.connect();
        const otp = Math.floor(100000 + Math.random() * 900000);
        const valid_upto = Date.now() + 5 * 60 * 1000;
        const query = "INSERT INTO `otp`( `mobile`, `otp`, `valid_upto`, `otp_count`) VALUES (" + mobile + ", " + otp + ", " + valid_upto + ", 1)";
        con.query(query, function (err, rows, fields) {
          con.release();
          if (err) return callback(err, null, null);
          return callback(null, rows, fields)
        })
      })
    }
    catch (err) {
      callback(err, null)
    }
  },

  verifyMobile: function (mobile, callback) {
    getConnection((err, con) => {
      if (err) return callback(err, null, null);
      const currentTime = Date.now();
      const query = `SELECT * FROM otp WHERE mobile=${mobile} AND valid_upto > ${currentTime} AND otp_count <= 5`;
      con.query(query, function (err, rows, fields) {
        con.release();
        if (err) return callback(err, null, null);
        return callback(null, rows, fields)
      })

    });
  },

  incrementOtpCount: function (mobile, callback) {
    const query = `UPDATE otp SET otp_count = otp_count+1`;
    getConnection((err, con) => {
      if (err) return callback(err, null, null);
      con.query(query, function (err, rows, fields) {
        con.release();
        if (err) return callback(err, null, null);
        return callback(null, rows, fields)
      })
    })
  },

  verifyOtp: function (mobile, otp, callback) {
    if (!mobile || !otp) return callback("Invalid mobile or otp", null);
    const currentTime = Date.now();
    const query = `SELECT * FROM otp WHERE mobile=${mobile} AND valid_upto > ${currentTime} AND otp = ${otp}`
    getConnection((err, con) => {
      if (err) return callback(err, null, null);
      con.query(query, function (err, rows, fields) {
        con.release();
        if (err) return callback(err, null, null);
        return callback(null, rows, fields)
      })
    })

  }
}