import { useState } from "react";
import type { ActionFunction } from "remix";
import { Form, json, useActionData, useTransition } from "remix";
import type { MetaFunction } from "remix";
import {
  InputWrapper,
  Input,
  Button,
  Alert,
  createStyles,
} from "@mantine/core";
import { At } from "tabler-icons-react";
import { AlertCircle } from "tabler-icons-react";
import { motion, AnimatePresence } from "framer-motion";

import { EMAIL_JOB_QUEUE } from "~/constants";
import { queue } from "~/queues/email";

interface QUEUE_RESPONSE {
  success: boolean;
  message: string;
}

export let meta: MetaFunction = () => {
  return {
    title: "Sign In",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json(
      {
        success: false,
        message: "Invalid email address",
      },
      { status: 400 }
    );
  }

  await queue.add(
    EMAIL_JOB_QUEUE,
    {
      emailAddress: email,
    },
    { delay: 2000 }
  );

  return json({
    success: true,
    message: `Email queued for ${email}!`,
  });
};

const useStyles = createStyles((theme, _params, getRef) => ({
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 40,
  },
  alert: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

export default function Queue() {
  const actionMessage = useActionData<QUEUE_RESPONSE>();
  const transition = useTransition();
  const { classes } = useStyles();
  const [email, setEmail] = useState("");

  const message = actionMessage?.message;
  const success = actionMessage?.success;

  return (
    <Form method="post">
      <h2>Send an email</h2>
      <div style={{ height: 80 }}>
        <AnimatePresence>
          {actionMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert
                icon={<AlertCircle size={16} />}
                color={success ? "blue" : "red"}
                className={classes.alert}
              >
                {message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InputWrapper
        id="email"
        required
        label="Email Address"
        description="Please enter your email address"
      >
        <Input
          className={classes.input}
          id="email"
          name="email"
          icon={<At />}
          variant="filled"
          placeholder="Your email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </InputWrapper>
      <Button
        className={classes.button}
        type="submit"
        loading={transition.state === "idle" ? false : true}
        disabled={!email}
      >
        {transition.state === "idle" ? "Send" : "Sending"}
      </Button>
    </Form>
  );
}
