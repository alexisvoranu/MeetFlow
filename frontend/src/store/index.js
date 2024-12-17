import { createStore } from "vuex";
import events from "./modules/participantEvents";
import organizerEvents from "./modules/organizerEvents.js";
import eventGroups from "./modules/eventGroups";

const store = createStore({
  modules: {
    events,
    organizerEvents,
    eventGroups,
  },
});

export default store;
