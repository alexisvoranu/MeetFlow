<template>
  <div class="card">
    <div class="card-header">Event Group</div>
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text">{{ description }}</p>
      <div class="card-actions">
        <button type="button" class="btn btn-danger" @click="deleteEventGroup">
          Delete
        </button>
        <button class="btn btn-primary" @click="handleSeeEventsClick">
          See events
        </button>
        <button
          type="button"
          class="btn btn-success"
          @click="downloadXlsForEventGroup"
        >
          Download XLS
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

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

    const deleteEventGroup = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/eventGroups/delete/${props.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    };

    const handleSeeEventsClick = () => {
      const groupDetails = {
        id: props.id,
        name: props.name,
        description: props.description,
      };
      router.push({ name: "event-all", state: { groupDetails } });
    };

    const downloadXlsForEventGroup = async () => {
      const workbook = XLSX.utils.book_new();

      try {
        const eventsResponse = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/events/getEventsByEventsGroup?groupId=${props.id}`
        );
        const events = await eventsResponse.json();

        for (const event of events) {
          if (event.status === "OPEN") {
            const participantsResponse = await fetch(
              `${
                import.meta.env.VITE_SERVER_URL
              }/participants/getByEvent?eventId=${event.id}`
            );
            const participants = await participantsResponse.json();
            const confirmationDetails = participants.map((p) => ({
              Name: p.participant.name,
              Email: p.participant.email,
              RegistrationTime: formatDate(p.registrationTime),
            }));

            const worksheet = XLSX.utils.json_to_sheet(confirmationDetails);
            XLSX.utils.book_append_sheet(workbook, worksheet, event.name);
          }
        }

        XLSX.writeFile(
          workbook,
          `Participants - Event_Group_${props.name}.xlsx`
        );
      } catch (error) {
        console.error(
          "Error while generating the xls file for the event group:",
          error
        );
      }
    };

    return {
      deleteEventGroup,
      handleSeeEventsClick,
      downloadXlsForEventGroup,
    };
  },
};
</script>

<style scoped>
.card {
  margin: 2rem;
}

.card-header {
  text-align: left;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-title {
  text-align: left;
}

.card-text {
  text-align: left;
}

.card-actions {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
</style>
