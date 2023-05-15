//REGISTER
const router = ( email, username, password, mobile ) => {
    const mail=["venkiufie@gmail.com"];
    const usr=["venki8"];
    const pwd=["Venki2002@"];
    const mob=[8759552259];

    if (!email || !username || !password || !mobile){
        return Promise.resolve("All fields are required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return Promise.resolve("Invalid email address.");
    }
    if (!/^[a-zA-Z0-9]{4,}$/.test(username)){
        return Promise.resolve("Username must be at least 4 characters long and can only contain letters and numbers.");
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
        return Promise.resolve("Invalid mobile number.");
    }
   if(email==mail[0])
   {
        return Promise.resolve("Email address is already registered.");
   }
   if(mobile==mob[0])
   {
        return Promise.resolve("Mobile number is already registered.");
   }
   if(email!=mail[0] && username!=usr[0] && mobile!=mob[0])
   {
        return Promise.resolve("Sucessfully Registered")
   }
    
};

//LOGIN
const login = (email,password) => {
    const mail=["venkiufie@gmail.com"];
    const usr=["venki8"];
    const pwd=["Venki2002@"];
    if (!email || !password) {
        return Promise.resolve("Email and password are required!");
    }
    if(email!=mail[0])
    {
        return Promise.resolve("User is not registered, Sign Up first");
    }
    if(password!=pwd[0])
    {
        return Promise.resolve("Enter correct password!");
    }
    if(email==mail[0] && password==pwd[0])
    {
        return Promise.resolve("User signed in!");
    }
};

//SEND OTP
const sendOtp = (mobile,otp) => {
    
    if(mobile && !otp){
        return Promise.resolve("No OTP received")
    }

    if(!mobile && !otp){
        return Promise.resolve("No Mobile number")
    }

    else{
        return Promise.resolve("OTP sent")
    }
};

//VERIFY OTP
const verifyOtp = (mobile,otp) => {
    const mobileArray = [8759552259];
    const otpArray = [1234];

    if(mobileArray[0] == mobile && otpArray[0] == otp)
    {
        return Promise.resolve("OTP Verified");
    }

    if(mobileArray[0]!=mobile && otpArray[0]!= otp)
    {
        return Promise.resolve("Not Verified");
    }
}



//FORGOT PASSWORD
const forgotpassword = (email) => {
    if(!email)
    {
        return Promise.resolve("Enter Email to send OTP");
    }

    if(email)
    {
        return Promise.resolve("Mail Successfully Sent");
    }
}

//UPDATE PASSWORD
const updatepassword = (email,new_password) => {
    const mail = ["vaibhav@test.com"];
    
    if(!email && !new_password)
    {
        return Promise.resolve("Enter the email and the new password");
    }
    
    if(email==mail[0] && !new_password)
    {
        return Promise.resolve("Enter the new password");
    }

    if(email==mail[0] && new_password)
    {
        return Promise.resolve("Password Updated Succesfully");
    }

}

exports.router = router;
exports.login = login;
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.forgotpassword = forgotpassword
exports.updatepassword =updatepassword