import cron from "node-cron";
import * as eventsService from "../backend/services/events.js";

const verifyEventsStartedChroneJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const eventsList = await eventsService.getAllEvents();

      for (const event of eventsList) {
        const currentDate = new Date();

        if (currentDate >= new Date(event.startDate)) {
          await eventsService.changeEventStatus(event.id, "Closed");
        } else {
          await eventsService.changeEventStatus(event.id, "Open");
        }
      }
    } catch (error) {
      console.error(
        "There was an error while updating the events statuses",
        error
      );
    }
  });
};

export { verifyEventsStartedChroneJob };
