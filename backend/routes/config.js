import express from "express";

import { router as eventGroupsRouter } from "./eventGroups.js";
import { router as eventsRouter } from "./events.js";
import { router as participantsRouter } from "./participants.js";

export const router = express.Router();

router.use("/eventGroups", eventGroupsRouter);
router.use("/events", eventsRouter);
router.use("/participants", participantsRouter);
