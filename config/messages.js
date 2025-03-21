module.exports = {
  user: {
    email: {
      invalid: 'Please, enter a valid email',
      required: 'Email is required',
      unique: 'This email has been already registered',
    },
    api: {
      userNotFound: 'User not found',
      wrongPassword: 'Authentication failed. Wrong password',
      tokenExpired: 'Token expired',
    },
  },
  category: {
    required: {
      title: 'Title is required',
      category: 'Category is required',
    },
    api: {
      categoryDeleted: 'Category has been successfully deleted',
      categoryNotFound: 'Category not found',
    },
  },
  photoSession: {
    api: {
      photoSessionDeleted: 'Photo session has been successfully deleted',
      photoSessionNotFound: 'Photo session not found',
    },
    required: {
      title: 'Title is required',
    },
  },
  section: {
    required: {
      title: 'Title is required',
    },
  },
};