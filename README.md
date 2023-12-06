# 4 Hands
![image](https://github.com/LMC-Org/project-3-server/assets/102831536/c46b25c8-8ff6-435d-b9c7-7056669629cf)

#### App which connects people needing help with those ready to lend a hand.

###### A full-stack MERN Web Application created by:

[Clara Tesmon](https://github.com/claratesmon)

[Lino Zimmerman](https://github.com/Linozimerman)

[Martin Palkov](https://github.com/mpalkov)

---  
&nbsp;  
&nbsp;

## Highlights:

- Users can post help requests.
- Another users can offer to help you with it.
- For each help to others, you earn one app-token.
- Each token allows the user to post one help request.
- First-time users get 3 tokens to start with.
- Users can browse and volunteer for posts (help requests) that align with their skills and availability.  
&nbsp;

## Why?
- Help is not accessible for many people.
- What is difficult for you might come easy to others.
- Where community support meets meaningful connections.

&nbsp;  
&nbsp;

# [DEMO](https://main--super-salmiakki-8cf1b3.netlify.app/)

&nbsp;  
&nbsp;


### Frontend Routes

| Component | Path | Description |
|--------|------|-------------|
| LandingPage | / | Show Landing Page to anonymous users  OR HomePage to logged-in users|
| HomePage | /home | Show Home Page to logged-in users | 
| SignupPage | /signup | Show Signup Page to anonymous users | 
| LoginPage | /login | Show Log-in Page to anonymous users | 
| CreateTestimonyPage | /createtestimony | Show Page to Create testimonies  to logged-in users | 
| TestimonialPage | /alltestimonies | Show All testimonies Page to logged-in users | 
| CreateHelpForm | /createhelp | Show Form to create help request. Logged-in users only. | 
| PostDetails | /help-post/:helpId | Shows page with post details. Depending on various conditions (is current user owner? Is current user volunteer for this post? Is this post completed? ...) various information and buttons are displayed / available. Logged-in users only. | 
| UserProfile | /user/:userId | Show user profile details. | 
| MyProfile | /myprofile | Show my "dashboard" - vierw staste of your tokens, Posts you are owner and posts you have offered your help. Logged-in users only. | 
| EditProfile | /editprofile | Edit My user profile. Not possible to edit another user. Only logged-in users.| 
| EditHelpForm | /edithelp/:helpId | Form to edit your selected post. Only posts you are owner of. Only logged-in users. | 
| NotFoundPage | /* | Show "page not found" page on non-existent URL entry. Not restricted. | 

&nbsp;  
&nbsp;  

### Backend Routes


| Method | Path | Description |
|--------|------|-------------|
| GET | /api/home | Retrieves Help Posts in the database and responds with the data in a JSON array format |
| GET | /user/:userId | Retrieves the selected user data in from the database and sends it in JSON format in a response |
| PUT | /user/edituser | Receives new user data in request body and updates the user information in database with this data |
| POST | /auth/signup | Receives in the request body users name, email and password. Performs various checks (valid password, valid and unique e-mail, ...) and, if everything is correct, creates a new user in the database. The user password is hashed with bcrypt before storing it. If everything is ok, sends a JSON response containing the user object. |
| POST | /auth/login | Recieves user e-mail and password and verifies if it's correct and matches the saved password hash. Responds with a JWT (JSON Web Token) |
| GET | /auth/verify | Recieves JWT in the request. If this token is valid, it is decoded by the isAuthenticated middlewareand and the payload object containing the user data is sent back in response. |
| POST | /help-post/createhelp | Creates new HelpPost object in database and adds creates a relation of this newly created HelpPost with it's creator. The creator is substracted 1 token. Responds with the newly created object as JSON data. |
| GET | /help-post/:helpId | Finds the requested HelpPost in the database by the provided id, populates creator and volunteers and sends it back as JSON data in the response. |
| PUT | /help-post/edithelp/:helpId | The HelpPost is updated in the database with new data provided in request body. |
| DELETE | /help-post/edithelp/:helpId | The HelpPost is deleted from the database and it's id is removed from the owner's list of posts.  |
| POST | /help-post/addvolunteer | Receives volunteerId and postId in request body and creates relation of this two in the database. |
| POST | /help-post/selectvolunteer | Receives volunteerId and postId in request body. The user's id is moved from volunteers array into the selectedVolunteer field. |
| GET | /help-post/volunteered/:userId | Gets all the HelpPosts that have my id in volunteers array or selectedVolunteer field. |
| PUT | /help-post/setcompleted | Sets the HelpPost isCompleted field as true and adds 1 token to the user who is in the selectedVolunteer field of this post. |
| POST | /testimonies/createtestimony | Creates a new Testimony in the database with the data provided in the request body. |
| GET | /testimonies/alltestimonies | Retrieves all testimonies from the database, populates owners' name and profilePicture and sends it as JSON object in the response. |
| GET | /testimonies/landing | Retrieves four testimonies from the database to be shown on the landing page, populates owners' name and profilePicture. Sorts them as newest first and sends it back as JSON object in the response. |

&nbsp;  
&nbsp;  
&nbsp;

## Technical Requirements
1. Have a SPA frontend, built with React, consisting of multiple views and implementing all CRUD actions.
2. Have a REST API backend built with ExpressJS, MongoDB and Mongoose, that your React app will communicate with.
3. Have a REST API backend with routes that perform all CRUD actions for at least one model (excluding the user model).
4. Have 3 database models or more. Having one model for users is the first step. The other two (or more) models should represent the main functionality of your app.
5. Include sign-up, log-in and log-out functionality with encrypted passwords (or social login) and authorization (logged-in users can do additional things).
6. Have two separate repos on GitHub. One repo is for your frontend React application and the other is for your backend REST API.
7. Have at least 2 commits per day/person that you worked on.
8. Have a backend validation and centralized error handling in your REST API. 9. Validation erros must be displayed in the frontend also.
10. Be deployed online, allowing anyone to access and use your app. We are going to use Adaptable for the backend and Netlify for the frontend. 
11. Responsive desing. Mobile first approach. Prioritize the mobile view, don't start styling in desktop view. 
12. Ensure all the features are implemented and working ahead of delivery in the deployed version (check envieronment variables).
13. The use of AI is permited. But make sure that you understand the code, implement it to suit your application's needs, and adhere to our established architecture and coding standards.
