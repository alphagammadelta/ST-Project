jest.mock('./user.js');

const {updatepassword} = require('./user');

describe("UPDATE_PASSWORD", () => {
    test("Both Fields are empty", () => {
        updatepassword(

        ).then(title => {
            expect(title).toBe("Enter the email and the new password")
        })
    });

    test("New Password Field is empty", () => {
        updatepassword("vaibhav@test.com",
        ).then(title => {
            expect(title).toBe("Enter the new password")
        })
    });

    test("Both Fields are filled", () => {
        updatepassword("vaibhav@test.com",
        "vaibhav123").then(title => {
            expect(title).toBe("Password Updated Succesfully")
        })
    });
});