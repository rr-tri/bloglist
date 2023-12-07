
# BlogList

This project is part of the Full Stack Open course. It's a full-stack web application built using technologies like React, Express, MongoDB, and more.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

BlogList is a  platform that allows users to create, read, update, and delete their favourite blog posts. It also provides functionalities like user registration, authentication, and user profile management.

## Features

- User authentication and authorization
- CRUD operations for blogs
- View user profiles and their blogs
- Responsive design

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repository: `git clone https://github.com/rr-tri/bloglist.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Usage

Once the development server is running, you can access the application in your web browser at `http://localhost:8080` (or a different port if specified).

## Folder Structure

```
bloglist/

├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Blogs.jsx
│   │   ├── Menu.jsx
│   │   ├── Notification.jsx
│   │   ├── Blog.jsx
│   │   ├── User.jsx
│   │   ├── LoginForm.jsx
│   │   ├── Users.jsx
│   │   └── Register.jsx
│   ├── contexts/
│   │   ├── NotificationContext.jsx
│   │   └── UserContext.jsx
│   ├── services/
│   │   ├── blogs.js
│   │   └── users.js
│   ├── index.jsx
│   └── App.jsx
├── dist/
├── controllers/
│    ├── blogRoutes.js
│    ├── loginRoutes.js
│    ├── testing.js
│    └── userRoutes.js
│ 
├── models/
│    ├── blogSchema.js
│    ├── commentSchema.js
│    └── userSchema.js
├── utils/
│    ├── ....
│    ├── ....
│    └── middleware.js
├── app.js
├── .gitignore
├── package.json
├── webpack.config.js
└── README.md
```

## Dependencies

- React
- React Router
- Material-UI
- Axios
- Express
- MongoDB
- Mongoose
- JSON Web Token (jsonwebtoken)
- Bcrypt

For a full list of dependencies and devDependencies, refer to `package.json`.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact the author:

- **Author:** Ram Regmi
- **GitHub:** [rr-tri](https://github.com/rr-tri)

