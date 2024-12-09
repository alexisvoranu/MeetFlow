import express from 'express';
import * as participantsController from '../controllers/participants.js';

export const router = express.Router();

// router.get('/getById', participantsController.getParticipantById);

router.get('/getParticipantsByEvent', participantsController.getParticipantsByEvent);

// router.get('/getByEventGroup', participantsController.getParticipantsByEventGroup);

// router.get('/isRegistered', participantsController.isParticipantRegisteredForEvent);

// router.get('/getEvents', participantsController.getEventsForParticipant);

// router.post('/create', participantsController.create);

// router.post('/cancelRegistration', participantsController.cancelRegistration);

// router.post('/login', participantsController.login);

// router.put('/update', participantsController.update);

// router.delete('/remove/:id', participantsController.remove);