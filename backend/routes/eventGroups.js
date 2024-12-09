import express from "express";
import * as eventGroupController from "../controllers/eventGroups.js";

export const router = express.Router();

router.get("/getAllEventGroupsForOrganizer", eventGroupController.getAllForOrganizer);

// router.post('/create', eventGroupController.create)

// router.put('/update', eventGroupController.update)

// router.delete('/delete/:id', eventGroupController.remove)
