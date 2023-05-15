 jest.mock('./user.js');
 //const request = require('supertest');
 const {router} = require('./user');


  

  describe('POST /register', () => {
    test("Fields are empty", () => {
      router("venkiufie@gmail.com"
      ).then(title => {
        expect(title).toBe("All fields are required.");
      });
    });

    test('Invalid Email', () => {
        router("invalid", 
        "venki8",
        "Venki2002@",
        8759552259
        ).then(title => {
          expect(title).toBe("Invalid email address.");
        });
      });

      test('Username is invalid', () => {
        router("venkiufie@gmail.com",
        "ve",
        "Venki2002@",
        8759552259
        ).then(title => {
          expect(title).toBe("Username must be at least 4 characters long and can only contain letters and numbers.");
        });
      });

      test("Invalid mobile number.", () => {
        router("venkiufie@gmail.com",
        "venki8",
        "Venki2002@",
        "invalid"
        ).then(title => {
          expect(title).toBe("Invalid mobile number.");
        });
      });

      test('Email already exists', () => {
        router("venkiufie@gmail.com",
        "venki8",
        "Venki2002@",
        8759552258
        ).then(title => {
          expect(title).toBe("Email address is already registered.");
        });
      });

      test('Mobile nnumber already exists', () => {
        router("vaibhav@gmail.com",
        "vaibhav7",
        "Vaibhav2002@",
        1234567890
        ).then(title => {
          expect(title).toBe("Sucessfully Registered");
        });
      });
  });