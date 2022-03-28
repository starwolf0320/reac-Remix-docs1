import type { ActionFunction } from "remix";
import { Form, json, useActionData, useTransition } from "remix";

import { EMAIL_JOB_QUEUE } from "~/constants";
import { queue } from "~/queues/email";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json("Invalid email!", { status: 400 });
  }

  await queue.add(
    EMAIL_JOB_QUEUE,
    {
      emailAddress: email,
    },
    { delay: 2000 }
  );

  return json(`Email queued for ${email}!`);
};

export default function Index() {
  const actionMessage = useActionData<string>();
  const transition = useTransition();

  return (
    <main>
      <Form method="post">
        <h2>Send an email</h2>
        <label>
          <div>Email Address</div>
          <input name="email" />
        </label>
        <div>
          <button type="submit">
            {transition.state === "idle" ? "Send" : "Sending"}
          </button>
        </div>
      </Form>
      {actionMessage ? (
        <p>
          <b>{actionMessage}</b>
        </p>
      ) : null}
    </main>
  );
}
