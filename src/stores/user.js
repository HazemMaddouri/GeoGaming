import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // Define state properties here if needed
    onError: false,
    loggedin: true,
    admintoken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NlcGVncmEtZnJvbnRlbmQueHl6L3dmMTEtYXRlbGllciIsImlhdCI6MTcwOTEyODE1MiwibmJmIjoxNzA5MTI4MTUyLCJleHAiOjE3MDk3MzI5NTIsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.WvWfzVTkalj9yAFVkbMrXREJKrwR61EWEU8xqYfHb7M',
    myID: ref(''),
    myToken: ref(''),
    pageBool: ref(false),
    userData: {
      username: ref(''),
      email: ref(''),
      password: ref(''),
      avatar: ref()
    },
    userLogin: {
      username: ref(''),
      password: ref('')
    },
    userimglink: ref(''),
    isLoading: 0
  }),
  getters: {
    isItLoading: (state) => state.isLoading
  },
  actions: {
    setUserData(username, email, password) {
      this.userData.username = username
      this.userData.email = email
      this.userData.password = password
    },
    setUserLogin(username, password) {
      this.userLogin.username = username
      this.userLogin.password = password
    },
    rerout() {
      this.$router.push({ path: `/dash` })
    },
    onFileUpload(e) {
      this.userData.avatar = e.target.files[0]
    },
    async userDashImage() {
      const getmyimage = await fetch('https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.myToken}`
        }
      })
      const getmyimageresult = await getmyimage.json() 
      this.userimglink = getmyimageresult.acf.avatar
    },
    // Methods to interact with user data

    async createUser() {
      try {
        this.isLoading++
        const form = new FormData()
        form.append('username', this.userData.username)
        form.append('email', this.userData.email)
        form.append('password', this.userData.password)
        form.append('file', this.userData.avatar)

        const basicAuth = btoa('admin' + ':' + 'Yh2V sfDi 7Pek 2qMo rBb7 4tIu')

        const userSignUp = await fetch(
          'https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/users',
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${basicAuth}`
            },
            body: form
          }
        )
        if(!userSignUp.ok) {
          this.isLoading--
          this.onError = true
          return
        }

        const getUserToken = await fetch(
          'https://cepegra-frontend.xyz/wf11-atelier/wp-json/jwt-auth/v1/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: `${this.userData.username}`,
              password: `${this.userData.password}`
            })
          }
        )
        if(!getUserToken.ok) {
          this.isLoading--
          this.onError = true
          return
        }
        const thisToken = await getUserToken.json()

        const postUserImage = await fetch(
          'https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/media',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${thisToken.token}`
            },
            body: form
          }
        )
        if(!postUserImage.ok) {
          this.isLoading--
        }
        const postUserImageResponse = await postUserImage.json()
        const postUserImageLink = postUserImageResponse.link

        const patchUserImage = await fetch(
          'https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/users/me',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${thisToken.token}`
            },
            body: JSON.stringify({ fields: { avatar: `${postUserImageResponse.link}` } })
          }
        )
        if(!patchUserImage.ok) {
          this.isLoading--
        }
        if(userSignUp.ok, getUserToken.ok) {
        this.setUserLogin(this.userData.username, this.userData.password)
        this.pageBool = !this.pageBool
        }
        this.isLoading--
        
      } catch (error) {
        this.isLoading--
        this.onError = true
      }
    },
    async loginUser() {
      try {
        this.isLoading++
        const userLoginData = await fetch(
          'https://cepegra-frontend.xyz/wf11-atelier/wp-json/jwt-auth/v1/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userLogin)
          }
        )

        if (!userLoginData.ok) {
          throw new Error('Failed to login')
        }

        const userLoginInfo = await userLoginData.json()
        const userToken = userLoginInfo.token
        
        const userID = await fetch(
          `https://cepegra-frontend.xyz/wf11-atelier/wp-json/wp/v2/users/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        const myID = await userID.json()
        this.myID = myID.id
        this.myToken = userToken
        
        this.isLoading--
        return this.rerout(), this.userDashImage()
      } catch (error) {
        this.isLoading--
        throw error
      }

      //await userLogin.json()
    }
    // Add other methods as needed
  }
})

/*{
  "username":"userone",
  "email":"userone@gmail.com",
  "password":"userone",
  "acf":{
    "email":"userone@gmail.com",
    "mot_de_passe":"userone",
    "pseudo":"userone",
    "uid":"userone"
  }
}
*/
