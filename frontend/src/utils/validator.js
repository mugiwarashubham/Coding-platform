const validator = require('validator');

const validate = (data) => {

    const mandatoryField = ['firstName', 'emailId', 'password'];

    const isAllowed = mandatoryField.every((key) =>
        Object.keys(data).includes(key)
    );

    if (!isAllowed) {
        throw new Error("Some field missing");
    }

    if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid email id");
    }

    if (!validator.isStrongPassword(data.password)) {
        throw new Error("Weak password");
    }
};

module.exports = validate;