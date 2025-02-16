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
import { SERVER_URL } from "@/constants";

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

      const response = await fetch(
        `${SERVER_URL}/participants/getAllParticipants`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        errMsg.value =
          "Failed to verify participant status. Please try again later.";
        return;
      }

      const participants = await response.json();
      const isParticipant = participants.some(
        (participant) => participant.email === email.value
      );

      if (
        (!isParticipant && props.userRole === "participant") ||
        (isParticipant && props.userRole === "organizer")
      ) {
        const roleText =
          props.userRole === "participant" ? "a participant" : "an organizer";
        errMsg.value = `This user is not registered as ${roleText}.`;
        return;
      } else {
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

          const userDetails = {
            email: userEmail,
            name: userName,
          };

          localStorage.setItem("userDetails", JSON.stringify(userDetails));

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
