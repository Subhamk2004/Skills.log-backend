export const TaskValidationSchema = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'Title must be a string',
        },
        notEmpty: {
            errorMessage: 'Title is required',
        },
    },
    description: {
        in: ['body'],
        isString: {
            errorMessage: 'Description must be a string',
        },
        notEmpty: {
            errorMessage: 'Description is required',
        },
    },
    dueDate: {
        in: ['body'],
        isDate: {
            errorMessage: 'Due date must be a date',
        },
        notEmpty: {
            errorMessage: 'Due date is required',
        },
    },
    priority: {
        in: ['body'],
        isString: {
            errorMessage: 'Priority must be a string',
        },
        notEmpty: {
            errorMessage: 'Priority is required',
        },
    },
    username: {
        in: ['body'],
        isString: {
            errorMessage: 'Username must be a string',
        },
        notEmpty: {
            errorMessage: 'Username is required',
        },
    },
    status: {
        in: ['body'],
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