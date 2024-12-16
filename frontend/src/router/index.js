import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import ParticipantHome from "@/views/Participant/ParticipantHome.vue";
import OrganizerHome from "@/views/Organizer/OrganizerHome.vue";
import OrganizerEventGroups from "@/views/Organizer/OrganizerEventGroups.vue";
import OrganizerEvents from "@/views/Organizer/OrganizerEvents.vue";
import ParticipantEvents from "@/views/Participant/ParticipantEvents.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/signup",
    component: SignupView,
  },
  {
    path: "/participantHome",
    component: ParticipantHome,
    meta: { requiresAuth: true },
  },
  {
    path: "/organizerHome",
    component: OrganizerHome,
    meta: { requiresAuth: true },
  },
  {
    path: "/organizer/eventGroups",
    component: OrganizerEventGroups,
    meta: { requiresAuth: true },
  },
  {
    path: "/organizer/events", 
    name: "allEventsForOrganizer", 
    component: OrganizerEvents, 
    props: (route) => ({ groupId: route.query.groupId }), 
  },
  {
    path: "/participantEvents",
    component: ParticipantEvents,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
