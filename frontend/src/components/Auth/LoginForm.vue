<template>
  <form class="login-form-fields" @submit.prevent="handleLogin">
    <div class="form-floating mb-3">
      <input
        type="email"
        class="form-control"
        id="email"
        placeholder="name@example.com"
        required
        v-model="email"
      />
      <label for="email">Email address</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Password"
        required
        v-model="password"
      />
      <label for="password">Password</label>
    </div>
    <button type="submit" class="btn btn-primary mb-3 btn-login">Login</button>
    <div v-if="errMsg" class="alert alert-danger">{{ errMsg }}</div>
  </form>
</template>

<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "LoginForm",
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const errMsg = ref("");

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        errMsg.value = "Please fill in all fields.";
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        const token = await userCredential.user.getIdToken();
        localStorage.setItem("firebaseToken", token);

        const user = userCredential.user;
        const userName = user.displayName;
        const userEmail = user.email;

        localStorage.setItem("clientName", userName);
        localStorage.setItem("clientEmail", userEmail);
        localStorage.setItem("firebaseToken", token);

        const redirectPath =
          props.userRole === "organizer"
            ? "/organizerHome"
            : "/participantHome";
        router.push(redirectPath);
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-email":
            errMsg.value = "This email is invalid!";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with this email was found!";
            break;
          case "auth/wrong-password":
            errMsg.value = "The password is incorrect!";
            break;
          default:
            errMsg.value = "Email or password is incorrect!";
            break;
        }
      }
    };

    return {
      email,
      password,
      handleLogin,
      errMsg,
    };
  },
};
</script>
