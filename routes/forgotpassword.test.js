jest.mock('./user.js');

const {forgotpassword} = require('./user');

describe("FORGOT_PASSWORD", () => {
    test("Field is empty", () => {
        forgotpassword(

        ).then(title => {
            expect(title).toBe("Enter Email to send OTP");
        })
    });

    test("Field is filled", () => {
        forgotpassword("vaibhav@test.com"
        ).then(title => {
            expect(title).toBe("Mail Successfully Sent")
        })
    });
});