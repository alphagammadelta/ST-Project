jest.mock('./user.js');

const {login} = require('./user');

describe('LOGIN', () => {
    test("Fields are empty", () => {
      login("venkiufie@gmail.com"
      ).then(title => {
        expect(title).toBe("Email and password are required!");
      });
    });

    test("Unregistered User", () => {
        login("venkiu@gmail.com",
        "venki2002@"
        ).then(title => {
          expect(title).toBe("User is not registered, Sign Up first");
        });
      });

    test("Incorrect Password", () => {
        login("venkiufie@gmail.com",
        "venki22@"
        ).then(title => {
          expect(title).toBe("Enter correct password!");
        });
      });   

    test("Succesful Login", () => {
        login("venkiufie@gmail.com",
        "Venki2002@"
        ).then(title => {
          expect(title).toBe("User signed in!");
        });
      }); 
});