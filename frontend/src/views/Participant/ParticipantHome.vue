<template>
  <div className="main">
    <ParticipantNavbar />
  </div>
</template>

<script>
import ParticipantNavbar from "@/components/Participant/ParticipantNavbar.vue";

export default {
  name: "ParticipantHome",
  components: {
    ParticipantNavbar,
  },
  setup() {},
};
</script>

<style scoped>
.main {
  min-height: 100vh;
  height: 100%;
  background-image: linear-gradient(
    to right bottom,
    #051937,
    #033152,
    #004b6c,
    #006684,
    #0c829a
  );
}

.hello-text {
  font-size: 3rem;
  color: #fff;
  overflow: hidden;
  border-right: 0.05em solid orange;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: typing 3.5s steps(30, end), blink-caret 0.5s step-end infinite;
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
