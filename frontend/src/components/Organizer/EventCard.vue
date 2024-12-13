<template>
  <div>
    <!-- Event Card -->
    <div
      class="list-group-item list-group-item-action my-3"
      style="border-radius: 1rem"
    >
      <div class="d-flex w-100 justify-content-center">
        <h5 class="mb-2">{{ eventDetails?.name }}</h5>
      </div>
      <span
        :class="[
          'badge',
          eventDetails?.status === 'Open' ? 'bg-success' : 'bg-danger',
        ]"
      >
        {{ eventDetails?.status }}
      </span>
      <p class="my-2">{{ eventDetails?.description }}</p>
      <div class="mb-1">
        <small>Opens at: {{ formatDate(eventDetails?.startDate) }}</small>
        <br />
        <small>Closes at: {{ formatDate(eventDetails?.endDate) }}</small>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <div class="event-actions">
          <button class="btn btn-danger btn-sm" @click="deleteEvent">
            Delete event
          </button>
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#viewParticipantsModal"
            @click="openParticipantsModal"
          >
            View participants
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Confirmed Participants -->
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
              Confirmed Participants
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <div
                v-if="
                  confirmedParticipantsList && confirmedParticipantsList.length
                "
              >
                <div
                  v-for="participant in confirmedParticipantsList"
                  :key="participant.id"
                  class="list-group-item mb-2"
                  style="
                    background-color: aliceblue;
                    width: 100%;
                    border-radius: 8px;
                  "
                >
                  <div class="d-flex w-100 justify-content-center">
                    <h5 class="mb-3">{{ participant.name }}</h5>
                  </div>
                  <p class="mb-2">
                    Email: <strong>{{ participant.email }}</strong>
                  </p>
                </div>
              </div>
              <div v-else>
                <p class="no-participants-message">
                  There are no participants who confirmed the event.
                </p>
              </div>
            </div>
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
              class="btn btn-success"
              @click="downloadConfirmedParticipantsInXLSX"
              :disabled="
                !confirmedParticipantsList || !confirmedParticipantsList.length
              "
            >
              Download XLSX File
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_URL } from "@/constants";
import { ref } from "vue";
import * as XLSX from "xlsx";

export default {
  name: "EventCard",
  props: {
    eventDetails: Object,
  },
  setup(props) {
    const modalContent = ref("token");
    const confirmedParticipantsList = ref([]);
    const userDetails = ref(null);

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
      };
      return new Date(dateString).toLocaleDateString("ro-RO", options);
    };

    const handleModalContentChange = (content) => {
      modalContent.value = content;
    };

    const openParticipantsModal = () => {
      fetchConfirmedParticipants();
    };

    const fetchConfirmedParticipants = () => {
      fetch(
        `${SERVER_URL}/participants/getParticipantsForEvent?eventId=${props.eventDetails.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          confirmedParticipantsList.value = Array.isArray(data) ? data : [];
        })
        .catch((err) => {
          console.error(err);
          confirmedParticipantsList.value = [];
        });
    };

    const deleteEvent = () => {
      fetch(
        `${SERVER_URL}/events/deleteEventFromEventGroup?eventId=${props.eventDetails.id}&email=${userDetails.value.email}`,
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

    const downloadConfirmedParticipantsInXLSX = () => {
      if (
        !confirmedParticipantsList.value ||
        !confirmedParticipantsList.value.length
      ) {
        alert("There are no confirmed participants.");
        return;
      }

      try {
        const workbook = XLSX.utils.book_new();

        const formattedParticipants = confirmedParticipantsList.value.map(
          (p) => ({
            Name: p.name,
            Email: p.email,
          })
        );

        const worksheet = XLSX.utils.json_to_sheet(formattedParticipants);
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          props.eventDetails.name || "Participants"
        );

        XLSX.writeFile(
          workbook,
          `Participants-${props.eventDetails.name || "Event"}.xlsx`
        );
      } catch (error) {
        console.error("Error for downloading XLSX file:", error);
      }
    };

    getUserDetailsFromLocalStorage();

    return {
      modalContent,
      confirmedParticipantsList,
      formatDate,
      handleModalContentChange,
      openParticipantsModal,
      deleteEvent,
      downloadConfirmedParticipantsInXLSX,
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

.no-participants-message {
  font-size: 1rem;
  font-weight: bold;
}

button {
  margin: 10px;
}
</style>
