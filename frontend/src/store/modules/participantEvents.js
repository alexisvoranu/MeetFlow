import { SERVER_URL } from "@/constants";

export default {
  namespaced: true,
  state: () => ({
    events: [],
    alert: {
      show: false,
      type: "",
      message: "",
    },
  }),
  mutations: {
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_ALERT(state, { show, type, message }) {
      state.alert = { show, type, message };
    },
  },
  actions: {
    async fetchEvents({ commit }, email) {
      try {
        const res = await fetch(
          `${SERVER_URL}/events/getEventsForParticipant?email=${email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }

        const events = await res.json();
        commit("SET_EVENTS", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    async handleTokenSubmit({ commit }, { eventId, email }) {
      try {
        const res = await fetch(
          `${SERVER_URL}/participants/addParticipantToEvent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
            },
            body: JSON.stringify({ eventId, participantEmail: email }),
          }
        );

        const data = await res.json();
        switch (res.status) {
          case 403:
            commit("SET_ALERT", {
              show: true,
              type: "alert-danger",
              message:
                "The event is closed. You can no longer participate in this event.",
            });
            break;
          case 404:
            commit("SET_ALERT", {
              show: true,
              type: "alert-danger",
              message: "Invalid token. The event is not found.",
            });
            break;
          case 200:
            window.location.reload();
            break;
        }

        setTimeout(() => {
          commit("SET_ALERT", { show: false, type: "", message: "" });
        }, 3000);
      } catch (error) {
        console.error("Error submitting token:", error);
      }
    },
  },
  getters: {
    events: (state) => state.events,
    alert: (state) => state.alert,
  },
};
