<template>
  <div>
    <!-- Event Card -->
    <div
      class="list-group-item list-group-item-action my-3"
      style="border-radius: 1rem"
    >
      <div class="d-flex w-100 justify-content-center">
        <h3 class="my-2">{{ eventDetails?.eventName }}</h3>
      </div>

      <span
        :class="[
          'badge',
          eventDetails?.eventStatus === 'Open' ? 'bg-success' : 'bg-danger',
        ]"
      >
        {{ eventDetails?.eventStatus }}
      </span>
      <hr class="my-3" />

      <h4>
        <b>{{ eventDetails?.eventGroupName }}</b>
      </h4>
      <h6>by {{ eventDetails?.organizerName }}</h6>

      <hr class="my-3" />
      <p class="my-2">{{ eventDetails?.eventDescription }}</p>
      <div class="mb-1">
        <small>Opens at: {{ formatDate(eventDetails?.eventStartDate) }}</small>
        <br />
        <small>Closes at: {{ formatDate(eventDetails?.eventEndDate) }}</small>
        <hr class="my-3" />

        <p class="my-2">
          Access token: <b>{{ eventDetails?.eventId }}</b>
        </p>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <div class="event-actions">
          <button
            class="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#viewParticipantsModal"
          >
            Cancel registration
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Cancel registration -->
    <div
      class="modal fade"
      id="viewParticipantsModal"
      tabindex="-1"
      aria-labelledby="viewParticipantsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="viewParticipantsModalLabel">
              Cancel registration
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="no-participants-message">
              Are you sure you want to cancel the registration?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="cancelRegistration"
            >
              Cancel the registration
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_URL } from "@/constants";
import { ref, onMounted } from "vue";

export default {
  name: "ParticipantEventCard",
  props: {
    eventDetails: Object,
  },
  setup(props) {
    const modalContent = ref("token");
    const confirmedParticipantsList = ref([]);
    const userDetails = ref(null);
    const eventName = ref("");
    const eventDescription = ref("");
    const eventStartDate = ref("");
    const eventEndDate = ref("");

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
      }
    };

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Bucharest",
      };
      return new Date(dateString).toLocaleString("ro-RO", options);
    };

    const handleModalContentChange = (content) => {
      modalContent.value = content;
    };

    const cancelRegistration = () => {
      fetch(
        `${SERVER_URL}/participants/cancelRegistration?eventId=${props.eventDetails.eventId}&participantEmail=${userDetails.value.email}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          window.location.reload();
        })
        .catch((err) => console.error(err));
    };

    onMounted(() => {
      getUserDetailsFromLocalStorage();
    });

    return {
      modalContent,
      confirmedParticipantsList,
      formatDate,
      handleModalContentChange,
      cancelRegistration,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
    };
  },
};
</script>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  border-radius: 1rem;
}

.updateModal-body {
  justify-content: center;
  padding: 20px;
  align-items: center;
  gap: 2rem;
  border-radius: 1rem;
}

.no-participants-message {
  font-size: 1rem;
  font-weight: bold;
}

button {
  margin: 10px;
}
</style>
