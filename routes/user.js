const bcrypt = require("bcrypt");
const express = require("express");
const AWS = require('aws-sdk');
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config()
const router = express.Router();
const Client = require("pg").Pool;
const sendGridMail = require('@sendgrid/mail');
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1' // Update with your desired AWS region
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const client = new Client({
  user: "venki21122",
  host: "db.bit.io",
  database: "venki21122/EXAMINDIA",
  password: "v2_42zQy_dS9c3AHLcN3MUWJssPZ2Xrd",
  port:5432,
  ssl: true,
});

const jwt = require("jsonwebtoken");

sendGridMail.setApiKey("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");



router.post("/register", async (req, res) => {
  const { email, username, password, mobile } = req.body;
  // var email = req.body.email;
  // var username = req.body.username;
  // var password = req.body.password;
  // var mobile = req.body.mobile;
// Server-side validation
if (!email || !username || !password || !mobile) {
  return res.status(400).json({
    error: "All fields are required.",
  });
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({
    error: "Invalid email address.",
  });
}

if (!/^[a-zA-Z0-9]{4,}$/.test(username)) {
  return res.status(400).json({
    error: "Username must be at least 4 characters long and can only contain letters and numbers.",
  });
}



if (!/^[0-9]{10}$/.test(mobile)) {
  return res.status(400).json({
    error: "Invalid mobile number.",
  });
}

try {
  const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
    email,
  ]);
  const arr = data.rows;
  if (arr.length != 0) {
    return res.status(400).json({
      error: "Email address is already registered.",
    });
  } else {
    const data1 = await client.query(`SELECT * FROM users WHERE mobile=$1;`, [
      mobile,
    ]);
    const arr1 = data1.rows;
    if (arr1.length != 0) {
      return res.status(400).json({
        error: "Mobile number is already registered.",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err)
          res.status(err).json({
            error: "Server error",
          });
        const user = {
          email,
          username,
          password: hash,
          mobile,
          verified: false,
        };
        var flag = 1;

        //Inserting data into the database

        client.query(
          `INSERT INTO users (email,username,password,mobile,verified) VALUES ($1,$2,$3,$4,$5);`,
          [user.email, user.username, user.password, user.mobile, user.verified],
          (err) => {
            if (err) {
              flag = 0; //If user is not inserted is not inserted to database assigning flag as 0/false.
              console.error(err);
              return res.status(400).json({
                error: "Database error",
              });
            } else {
              flag = 1;
              res
                .status(200)
                .send({ message: "User added to database, not verified" });
            }
          }
        );
        if (flag) {
          const token = jwt.sign(
            //Signing a jwt token
            {
              email: user.email,
            },
            "hey this is test"
          );
        }
      });
    }
  }
} catch (err) {
  console.log(err);
  res.status(400).json({
    error: "Database error while registering user!", //Database connection error
  });
}


});



























router.post('/sendOtp',async (req, res) => {
  var mobileNo =req.body.mobileNo;
  var OTP = generateRandomNumber(1000, 9999);
 
  var params = {
    Message: "Welcome! your mobile verification code is: " + OTP + " Mobile Number is:" + mobileNo, 
    PhoneNumber: mobileNo,
  };
try{
  const data = await client.query(
    `SELECT * FROM users WHERE mobile =$1;`,
    [mobileNo]
  );
 
  const arr = data.rows;
    if (arr.length === 0) {
      return res.status(404).json({
        error: "Mobile number not found.",
      });
    }
    else{
      const message = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
      client.query(
        "UPDATE users SET otp = $1 where mobile = $2",
        [OTP,mobileNo],
        (error, results) => {
          if (error) {
            return res.status(400).send(error);
          }
          res.status(200).json({ success: true, message: "OTP sent successfully" });
        }
      );
    }
}
catch(err){
  console.log("Error " + err)
  res.status(500).json({ success: false, message: "Failed to send OTP", error: err });
}
});




router.get('/verifyotp',async(req,res)=>{
try{
  const mobile=req.body.mobile;
  const otp_entered=req.body.otp_entered;
  const data = await client.query(
    `SELECT * FROM users WHERE mobile =$1;`,
    [mobile]
  );

  const arr = data.rows;
    if (arr.length === 0) {
      return res.status(404).json({
        error: "Mobile number not found.",
      });
    }
    else {
      client.query(
        "SELECT otp FROM users WHERE mobile =$1;",
        (error, results) => {
          if (error) {
            return res.status(400).send(error);
          }
          else{
            if(results.otp==otp_entered){
              client.query(
                "UPDATE users SET verified = true where mobile = $1",
                [mobile],
                (error, results) => {
                  if (error) {
                    return res.status(400).send(error);
                  }
                  res.status(200).send(`OTP verified sucessfully`);
                }
              );
            }
          }

        }
      );
    }

}catch(err){
res.status(500).send(err);
}
})


// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are present in the request body
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required!",
    });
  }

  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]); //Verifying if the user exists in the database
    const user = data.rows;
    if (user.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        } else if (result === true) {
          const token = jwt.sign(
            {
              email: email,
            },
            "hey this is test"
          );
          res.status(200).json({
            message: "User signed in!",
            token: token,
          });
        } else {
          if (result != true)
            res.status(400).json({
              error: "Enter correct password!",
            });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error occurred while signing in!",
    });
  }
});



// profile function

router.get("/profile/:email", async (req, res) => {
  id = req.params.email;
  try {
    const data = await client.query(
      `select * from users where email = $1;`,
      [id]
    );
    const arr = data.rows;
    if (arr.length === 0) {
      return res.status(404).json({
        error: "no orders found.",
      });
    } else {
      return res.status(200).json({ arr });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});


// mail function



function getOrderConfirmationEmailHtml() {
  return `<h3>Hi,The OTP is</h3>`;
}
function getMessage(emailPerson) {
console.log(emailPerson)
  return {
    to:emailPerson,
    from: 'srivastavashubham2003@gmail.com',
    subject: 'Email Verification',
    text: "Otp For Email verification",
    html: getOrderConfirmationEmailHtml(),
  };
}

async function sendOrderConfirmation(email) {
  try {
    await sendGridMail.send(getMessage(email));
    return  { message: "Mail is sent successfully"};
  } catch (error) {
      console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
    return {message};
  }
}





router.post("/forgotpassword", async (req, res) => {
  res.json(await sendOrderConfirmation("venkatesh21np@gmail.com",));
});

router.put("/updatepassword", async (req, res) => {
  try{
    const {email,password}=req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const data1 = await client.query(
      `SELECT * FROM users WHERE email =$1;`,
      [email]
    );
    const arr = data1.rows;
    if (arr.length === 0) {
      return res.status(404).json({
        error: "Email not found.",
      });
    }
    else{
      const data = await client.query(
        `UPDATE users SET password = $1 WHERE email = $2;`,
        [hashPassword,email]
      );
      res.status(200).json({
        message: "Password updated successfully",
      });

    }
    
  }
  catch(error){
     res.status(500).send(error);
  }
});






module.exports = router;
