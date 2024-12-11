import express from "express";
import * as eventsController from "../controllers/events.js";
import {
  validateEvent,
  validateEventPatch,
} from "../middlewares/validateEvent.js";

export const router = express.Router();

router.get(
  "/getAllEvents",
  eventsController.getAllEvents
);

router.get(
  "/getAllEventsForOrganizer",
  eventsController.getAllEventsForOrganizer
);

router.get("/getEventsByEventsGroup", eventsController.getAllEventsForGroup);

router.get("/getEventsByStatus", eventsController.getEventsByStatus);

router.get(
  "/getEventsForParticipant",
  eventsController.getEventsForParticipant
);

router.post(
  "/addEventToEventGroup",
  validateEvent,
  eventsController.addEventToEventGroup
);

router.patch(
  "/updateEventInEventGroup",
  validateEventPatch,
  eventsController.updateEventInEventGroup
);

router.delete(
  "/deleteEventFromEventGroup",
  eventsController.deleteEventFromEventGroup
);
