import express from "express";
import * as participantsController from "../controllers/participants.js";
import * as eventService from "../services/events.js";

export const router = express.Router();

router.get("/getAllParticipants", participantsController.getAllParticipants);

router.get(
  "/getParticipantsForEventGroup",
  participantsController.getParticipantsForEventGroup
);

router.get(
  "/getParticipantsForEvent",
  participantsController.getParticipantsForEvent
);

router.post(
  "/addParticipantToEvent",
  participantsController.addParticipantToEvent
);

router.delete("/cancelRegistration", participantsController.cancelRegistration);
