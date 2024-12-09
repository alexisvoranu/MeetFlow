import express from 'express';
import * as eventsController from "../controllers/events.js"

export const router = express.Router();

// router.get('/getEventById', eventsController.getEventById);

// router.get('/getEventsByOrganizer', eventsController.getAllEventsForOrganizer);

router.get('/getEventsByEventsGroup', eventsController.getAllEventsForGroup);

// router.get('/getEventsByStatus', eventsController.getEventsByStatus);

// router.get('/getEventToken', eventsController.getAccessTokenForEvent);

// router.get('/getEventsForParticipant', eventsController.getAllEventsForParticipant);

// router.post('/create', eventsController.create);

// router.put('/update', eventsController.update);

// router.patch('/setEventStatus', eventsController.changeEventStatus);

// router.post('/registerParticipantToEvent', eventsController.registerParticipantToEvent);

// router.delete('/remove/:id', eventsController.remove);
