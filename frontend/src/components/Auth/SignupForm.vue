<template>
  <div class="form-container">
    <form class="signup-form" @submit.prevent="register">
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Enter your full name"
          v-model="name"
          required
        />
        <label for="name">Full Name</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          v-model="email"
          required
        />
        <label for="email">Email address</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <label for="password">Password</label>
      </div>

      <button type="submit" class="btn btn-primary mb-3 btn-create-account">
        Create account
      </button>
    </form>
    <div
      v-if="errMsg"
      class="alert alert-danger d-flex align-items-center justify-content-center"
    >
      {{ errMsg }}
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "SignupForm",
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const email = ref("");
    const password = ref("");
    const name = ref("");
    const router = useRouter();
    const errMsg = ref("");

    const register = async () => {
      errMsg.value = "";

      if (!email.value || !password.value || !name.value) {
        errMsg.value = "Please fill in all fields.";
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        updateProfile(userCredential.user, {
          displayName: name.value,
        });

        const userId = userCredential.user.uid;

        const db = getFirestore();
        const collection =
          props.userRole === "organizer" ? "organizers" : "participants";

        await setDoc(doc(db, collection, userId), {
          name: name.value,
          email: email.value,
          createdAt: serverTimestamp(),
        });

        console.log("User successfully registered and saved in Firestore!");
        router.push("/");
      } catch (error) {
        console.error("Error during registration:", error);
        errMsg.value = error.message; 
      }
    };

    return {
      email,
      password,
      name,
      register,
      errMsg,
    };
  },
};
</script>

<style scoped>
.form-container {
  padding: 20px;
}

.btn-create-account {
  margin-top: 20px;
}

.form-control {
  width: 100%;
}

.alert {
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
}
</style>
