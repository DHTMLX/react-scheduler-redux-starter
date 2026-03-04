import { createAction } from "@reduxjs/toolkit";
import type { Dispatch } from "redux";
import type { SchedulerEvent } from "./types";

// Simulate receiving an ID from a backend.
const generateId = () => `id_${Date.now().toString()}`;

export const createEvent = createAction(
  "schedulerDomain/createEvent",
  (eventData: Omit<Partial<SchedulerEvent>, "id">) => {
    const newEvent: SchedulerEvent = {
      ...(eventData as Omit<SchedulerEvent, "id">),
      id: generateId(),
    };
    return { payload: newEvent };
  }
);

export const deleteEvent = createAction(
  "schedulerDomain/deleteEvent",
  (id: SchedulerEvent["id"]) => ({ payload: id })
);

export const updateEvent = createAction(
  "schedulerDomain/updateEvent",
  (eventData: Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">) => ({ payload: eventData })
);

// Helper function to dispatch an action and return its payload consistently
export function dispatchAction<Arg, Payload>(
  dispatch: Dispatch,
  actionCreator: (arg: Arg) => { type: string; payload: Payload },
  arg: Arg
): Payload {
  return dispatch(actionCreator(arg)).payload;
}
