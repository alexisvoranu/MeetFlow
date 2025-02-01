<template>
  <div className="home">
    <HomeNavbar />
    <div className="container">
      <div className="home-header">Welcome to MeetFlow!</div>
      <div className="home-text">A solution for events attendance tracking</div>
    </div>
  </div>
</template>

<script>
import HomeNavbar from "@/components/HomeNavbar.vue";

export default {
  name: "HomeView",
  components: {
    HomeNavbar,
  },
  setup() {},
};
</script>

<style scoped>
.home {
  background-image: linear-gradient(
    to right bottom,
    #051937,
    #033152,
    #004b6c,
    #006684,
    #0c829a
  );
  width: 100%;
  height: 100vh;
  text-align: center;
}

.home-text {
  max-width: 100%;
  display: inline-block;
}

.home .container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
}

.home-header {
  margin-top: 10%;
  color: white;
  font-size: 50px;
  font-weight: bold;
}

.home-background-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.home-text {
  color: #fff;
  overflow: hidden;
  border-right: 0.15em solid orange;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: typing 3.5s steps(50, end), blink-caret 0.5s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: orange;
  }
}
</style>
