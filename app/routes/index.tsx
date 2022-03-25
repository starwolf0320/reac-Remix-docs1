import type { ActionFunction } from "remix";
import { Form, json, useActionData, useTransition } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (!name || typeof name !== "string") {
    return json("Invalid name!", { status: 400 });
  }

  return json(`${name}!`);
};

export default function Index() {
  const actionMessage = useActionData<string>();
  const transition = useTransition();

  return (
    <main>
      <Form method="post">
        <label>
          <input name="name" />
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
