jest.mock('./user.js');

const {verifyOtp} = require('./user');

describe("Verify_OTP",() => {
    test("Incorrect Data", () => {
        verifyOtp(1234567890
            ,1987).then(title => {
                expect(title).toBe("Not Verified");
            });
    });

    test("Correct Data", () => {
        verifyOtp(8759552259
            ,1234).then(title => {
                expect(title).toBe("OTP Verified");
            });
    });

});