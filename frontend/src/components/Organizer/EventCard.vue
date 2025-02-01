<template>
  <div>
    <!-- Event Card -->
    <div
      class="list-group-item list-group-item-action my-4"
      style="border-radius: 1rem"
    >
      <div class="d-flex w-100 justify-content-center">
        <h3 class="my-2">{{ eventDetails?.name }}</h3>
      </div>
      <span
        :class="[
          'badge',
          eventDetails?.status === 'Open' ? 'bg-success' : 'bg-danger',
        ]"
      >
        {{ eventDetails?.status }}
      </span>
      <hr class="my-3" />
      <p class="my-2">{{ eventDetails?.description }}</p>
      <div class="mb-1">
        <small>Opens at: {{ formatDate(eventDetails?.startDate) }}</small>
        <br />
        <small>Closes at: {{ formatDate(eventDetails?.endDate) }}</small>
        <hr class="my-3" />

        <p class="my-2">
          Access token: <b>{{ eventDetails?.id }}</b>
        </p>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <div class="event-actions">
          <button
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#viewParticipantsModal"
            @click="openParticipantsModal"
          >
            View participants
          </button>
          <button class="btn btn-warning btn-sm" @click="openUpdateModal">
            Update event
          </button>
          <button class="btn btn-danger btn-sm" @click="deleteEvent">
            Delete event
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

    <!-- Modal for Update Event -->
    <div
      v-if="isModalOpen"
      class="modal fade show"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Update event
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeUpdateModal"
            ></button>
          </div>
          <div class="updateModal-body">
            <form @submit.prevent="updateEvent">
              <div class="mb-3">
                <label for="eventName" class="form-label"
                  >Event Group Name</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="eventName"
                  placeholder="Please enter a name for the event group"
                  v-model="eventName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="eventDescription" class="form-label"
                  >Event Group Description</label
                >
                <textarea
                  class="form-control"
                  id="eventDescription"
                  rows="4"
                  placeholder="Please enter a description for the event group"
                  v-model="eventDescription"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="eventName" class="form-label"
                  >Event Start Date</label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  id="eventStartDate"
                  placeholder="Please enter a name for the event group"
                  v-model="eventStartDate"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="eventName" class="form-label">Event End Date</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  id="eventEndDate"
                  placeholder="Please enter a name for the event group"
                  v-model="eventEndDate"
                  required
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  @click="closeUpdateModal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="isUpdating"
                >
                  {{ isUpdating ? "Updating..." : "Update" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SERVER_URL } from "@/constants";
import { ref, onMounted } from "vue";
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
    const isModalOpen = ref(false);
    const eventName = ref("");
    const eventDescription = ref("");
    const eventStartDate = ref("");
    const eventEndDate = ref("");
    const isUpdating = ref(false);

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
      }
    };

    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    const openUpdateModal = () => {
      isModalOpen.value = true;
      eventName.value = props.eventDetails.name;
      eventDescription.value = props.eventDetails.description;
      eventStartDate.value = formatDateForInput(props.eventDetails.startDate);
      eventEndDate.value = formatDateForInput(props.eventDetails.endDate);
    };

    const closeUpdateModal = () => {
      isModalOpen.value = false;
    };

    const updateEvent = async () => {
      isUpdating.value = true;
      try {
        const res = await fetch(
          `${SERVER_URL}/events/updateEventInEventGroup`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userDetails.value.email,
              eventId: props.eventDetails.id,
              name: eventName.value,
              description: eventDescription.value,
              startDate: eventStartDate.value,
              endDate: eventEndDate.value,
            }),
          }
        );
        if (res.ok) {
          closeUpdateModal();
          window.location.reload();
        } else {
          const errorData = await res.json();
          if (errorData.errors) {
            errorData.errors.forEach((error) => {
              alert(error.msg);
            });
          }
        }
      } catch (error) {
        console.error("Error updating event group:", error);
      } finally {
        isUpdating.value = false;
      }
    };

    onMounted(() => {
      getUserDetailsFromLocalStorage();
    });

    return {
      modalContent,
      confirmedParticipantsList,
      formatDate,
      handleModalContentChange,
      openParticipantsModal,
      deleteEvent,
      downloadConfirmedParticipantsInXLSX,
      openUpdateModal,
      closeUpdateModal,
      updateEvent,
      isModalOpen,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      isUpdating,
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
