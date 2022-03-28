import { EMAIL_JOB_QUEUE } from "~/constants";
import { Queue } from "~/utils/queue.server";

type QueueData = {
  emailAddress: string;
};

export const queue = Queue<QueueData>(EMAIL_JOB_QUEUE, async (job) => {
  console.log(`Job name ${job.name}`);

  console.log(`Sending email to ${job.data.emailAddress}`);

  console.log(`Email sent to ${job.data.emailAddress}`);
});
