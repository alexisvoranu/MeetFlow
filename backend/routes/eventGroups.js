import express from "express";
import * as eventGroupController from "../controllers/eventGroups.js";
import {
  validateEventGroup,
  validateEventGroupPatch,
} from "../middlewares/validateEventGroup.js";

export const router = express.Router();

router.get(
  "/getAllEventGroupsForOrganizer",
  eventGroupController.getAllForOrganizer
);

router.post(
  "/addEventGroupToOrganizer",
  validateEventGroup,
  eventGroupController.addEventGroupForOrganizer
);

router.patch(
  "/updateEventGroupForOrganizer",
  validateEventGroupPatch,
  eventGroupController.updateEventGroupForOrganizer
);

router.delete(
  "/deleteEventGroupForOrganizer",
  eventGroupController.deleteEventGroupForOrganizer
);
