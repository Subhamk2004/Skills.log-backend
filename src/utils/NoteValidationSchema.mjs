export const NoteValidationSchema = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'Title must be a string',
        },
        notEmpty: {
            errorMessage: 'Title is required',
        },
    },
    content: {
        in: ['body'],
        isString: {
            errorMessage: 'Content must be a string',
        },
        notEmpty: {
            errorMessage: 'Content is required',
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
    hashtags: {
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
    updated_at: {
        in: ['body'],
        isDate: {
            errorMessage: 'Updated date must be a valid date',
        },
        optional: true,
    },
};