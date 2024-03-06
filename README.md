# [PROJECT LINK](https://geogaming.netlify.app/)

# My contribution to this team project

I was tasked with handling the creation of the API via WordPress ACF to REST API and making the Login and SignUp pages.

# API
## What I've used for this -> WordPress(ACF, ACF to REST API, JWT-Auth)

I've made one Post type and two different Field groups.

ACF Post - "Matches" (This handles the creation of matches as a Post that will be linked with the Matches field to contain the data)
ACF Field group - "Matches" (This here is the field group that attaches all the data to the "Matches" post)

WordPress User - "User" (I ended up going with the integrated User creation since it automatically assigns UserIDs and with JWT-Auth it gives us a token to identify the user)
ACF Field group - "myUser" (I've used this to attach an avatar to the user, by uploading the avatar to WP Media and patching the link to the user on SignUp)

# Login & SignUp
## What we've used for this -> (Vue+Vite, Pinia, vue-router)

### Login 

I use a fetch with JWT-Auth to identify the user and receive the token, store it with Pinia and make the token and the userID(via users/me fetch) available to all my colleagues for their use in the other pages

### SignUp

I use five fetches,

userSignUp -> create User
getUserToken -> get new User's token via stored username and password
postUserImage -> post the image on WP/Media
patchUserImage -> patch the image link on to the user avatar field
userDashImage -> store the image link so all my colleagues can use it
