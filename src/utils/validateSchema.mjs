export const createUserValidationSchema = {
    username: {
        in: ['body'],
        isString: {
            errorMessage: 'Username must be a string',
        },
        notEmpty: {
            errorMessage: 'Username is required',
        },
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Not a valid email',
        },
        notEmpty: {
            errorMessage: 'Email is required',
        },
    },
    password: {
        in: ['body'],
        isString: {
            errorMessage: 'Password must be a string',
        },
        notEmpty: {
            errorMessage: 'Password is required',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
    },
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string',
        },
        notEmpty: {
            errorMessage: 'Name is required',
        },
    },
    githubUsername: {
        in: ['body'],
        isString: {
            errorMessage: 'GitHub username must be a string',
        },
        optional: true,
    },
    pat: {
        in: ['body'],
        isString: {
            errorMessage: 'PAT must be a string',
        },
        optional: true,
    },
    institute: {
        in: ['body'],
        isString: {
            errorMessage: 'Institute must be a string',
        },
        notEmpty: {
            errorMessage: 'Institute is required',
        },
    },
    primaryWork: {
        in: ['body'],
        isString: {
            errorMessage: 'Primary work must be a string',
        },
        notEmpty: {
            errorMessage: 'Primary work is required',
        },
    },
    image: {
        in: ['body'],
        isString: {
            errorMessage: 'Image URL must be a string',
        },
        optional: true,
    },
    bio: {
        in: ['body'],
        isString: {
            errorMessage: 'Bio must be a string',
        },
        optional: true,
    },
    skills: {
        in: ['body'],
        isArray: {
            errorMessage: 'Skills must be an array of strings',
        },
        optional: true,
    },
    projects: {
        in: ['body'],
        isArray: {
            errorMessage: 'Projects must be an array of strings',
        },
        optional: true,
    },
    friends: {
        in: ['body'],
        isArray: {
            errorMessage: 'Friends must be an array of strings',
        },
        optional: true,
    },
    created_at: {
        in: ['body'],
        isDate: {
            errorMessage: 'Created date must be a valid date',
        },
        optional: true,
    },
};
