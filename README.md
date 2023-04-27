# Student Management System (SMS)

This project is built using Node.js with Express.js as the backend and React.js as the frontend. The database used is PostgreSQL.

## Project Architecture

<a href="url"><img src=client/public/react-node-express-postgresql-crud-example-architecture.png  height="250" width="700"> </a>

### Backend

The backend is built using Node.js with Express.js as the server framework. The architecture of the backend follows a modular structure. The app is divided into multiple modules such as users, authentication, posts, comments, etc.

The server uses RESTful APIs to interact with the frontend. The APIs are secured using JWT authentication. The backend also uses Sequelize ORM to interact with the PostgreSQL database.

### Frontend

The frontend is built using React.js. The architecture of the frontend follows a component-based approach. The app is divided into multiple components such as Header, Footer, Posts, Comments, etc.

The frontend interacts with the backend through RESTful APIs. The frontend also uses React Router to handle client-side routing.

### Database

The database used in this project is PostgreSQL. The database schema follows a relational structure. The tables used in the database are users, courses, classes, grades etc.

## Authentication & Authorization

This project uses JSON Web Token (JWT) via cookies for user authentication and authorization.

### JSON Web Tokens (JWTs)

JSON Web Tokens, or JWTs, are a compact and self-contained way of transmitting information between parties as a JSON object. They are commonly used for authentication and authorization purposes in web applications. When a user logs in, the server generates a JWT that contains information about the user, such as the user's ID, name, and any necessary data. The JWT is then signed with a secret key known only to the server. The server sends the JWT to the client, and the client stores the JWT in a cookie or in local storage. The client sends the JWT with each subsequent request to the server, and the server verifies the token using the secret key. If the token is valid, the server grants access to the requested resource.

JWTs are secure because they are signed with a secret key, making them difficult to tamper with or forge. They are also scalable because they are stateless, which means that the server does not need to maintain a session state for each user. This makes it easier to scale the application.

### Cookies

Cookies, on the other hand, are small text files that are stored in a user's browser when they visit a website. Cookies are commonly used to maintain user sessions in web applications. When a user logs in, the server generates a session ID and stores it in a cookie. The cookie is sent to the client, and the client sends the cookie with each subsequent request to the server. The server uses the session ID to retrieve the user's session data from its database and grants access to the requested resource.

Cookies are widely supported by browsers and are easy to use, but they are vulnerable to attacks such as cross-site scripting (XSS) and cross-site request forgery (CSRF).

### JSON Web Token (JWT) via Cookies

JWT via cookies is used to authenticate and authorize users for both server-side and client-side requests. When a user logs in, the server creates a JWT token that contains the user's identity and any necessary data. The token is then signed with a secret key and sent to the client via a cookie.

The client sends the JWT token with each subsequent request to the server via the cookie. The server verifies the token using the secret key and, if the token is valid, authenticates the user and authorizes the user to access the requested resource. If the token is invalid or expired, the server returns an error message.

### Authentication

Authentication is the process of verifying the identity of a user. In this project, JWT is used for authentication. When a user logs in, the server creates a JWT token that contains the user's identity and any necessary data. The token is then signed with a secret key and sent to the client via a cookie.

The client stores the JWT token in the cookie and sends it with each subsequent request to the server. The server verifies the token using the secret key and, if the token is valid, authenticates the user and authorizes the user to access the requested resource. If the token is invalid or expired, the server returns an error message.

### Authorization

Authorization is the process of determining whether a user has the necessary permissions to access a resource. In this project, authorization is implemented using middleware functions in the server. These middleware functions check the user's authentication status and role to determine whether the user is authorized to access the requested resource.

### Advantages of JWT via Cookies

Using JWT via cookies provides several advantages:

- Security: JWT tokens are signed with a secret key, which makes them difficult to tamper with or forge. Cookies are also secure because they are stored in the user's browser and are only sent to the server with HTTPS requests.

- Scalability: JWT via cookies is a stateless mechanism for authentication, which means that the server does not need to maintain a session state for each user. This makes it easier to scale the application.

- Flexibility: JWT via cookies can be used for both server-side and client-side authentication, which makes it a flexible solution for different types of web applications.
