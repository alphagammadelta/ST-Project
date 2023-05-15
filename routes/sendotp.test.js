jest.mock('./user.js');

const {sendOtp} = require('./user');

describe('Send_OTP',() => {
    test("Fields are empty1", () => {
        sendOtp(8759552259
            ).then(title => {
                expect(title).toBe("No OTP received");
            });
    });

    test("Fields are empty2", () => {
        sendOtp(
            ).then(title => {
                expect(title).toBe("No Mobile number");
            });
    });
    
    test("All Fields are entered", () => {
        sendOtp(8759552259,1234
            ).then(title => {
                expect(title).toBe("OTP sent");
            });
    });
    
});