import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { seedEvents, seedDate, seedView } from "../seed/data";
import { createEvent, deleteEvent, updateEvent } from "./actions";
import type { SchedulerConfig, SchedulerEvent, SchedulerSnapshot, SchedulerView } from "./types";

interface SchedulerState {
  events: SchedulerEvent[];
  currentDate: number;
  view: SchedulerView;
  config: SchedulerConfig;

  past: SchedulerSnapshot[];
  future: SchedulerSnapshot[];
  maxHistory: number;
}

const deepCopy = <T,>(value: T): T => {
  // JSON clone is sufficient for this demo:
  // - events/config are plain objects
  // - we want immutable snapshots for undo/redo
  return JSON.parse(JSON.stringify(value)) as T;
};

const createSnapshot = (state: SchedulerState): SchedulerSnapshot => ({
  events: deepCopy(state.events),
  config: deepCopy(state.config),
});

const pushHistory = (state: SchedulerState) => {
  state.past.push(createSnapshot(state));

  if (state.maxHistory > 0 && state.past.length > state.maxHistory) {
    state.past.shift();
  }

  state.future = [];
};

const initialState: SchedulerState = {
  events: seedEvents as unknown as SchedulerEvent[],
  currentDate: seedDate,
  view: seedView as SchedulerView,
  config: {},

  past: [],
  future: [],
  maxHistory: 50,
};

const schedulerSlice = createSlice({
  name: "scheduler",
  initialState,
  reducers: {
    undo(state) {
      if (state.past.length === 0) return;

      const previous = state.past[state.past.length - 1];
      const newFuture = createSnapshot(state as SchedulerState);

      state.events = previous.events;
      state.config = previous.config;
      state.past = state.past.slice(0, -1);
      state.future = [newFuture, ...state.future];
    },
    redo(state) {
      if (state.future.length === 0) return;

      const next = state.future[0];
      const newPast = createSnapshot(state as SchedulerState);

      state.events = next.events;
      state.config = next.config;
      state.future = state.future.slice(1);
      state.past = [...state.past, newPast];
    },

    // Navigation is not an undoable user action in this demo.
    setCurrentDate(state, { payload }: PayloadAction<number>) {
      state.currentDate = payload;
    },
    setView(state, { payload }: PayloadAction<SchedulerView>) {
      state.view = payload;
    },

    updateConfig(state, { payload }: PayloadAction<Partial<SchedulerConfig>>) {
      pushHistory(state as SchedulerState);
      state.config = { ...state.config, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent, (state, action) => {
        pushHistory(state as SchedulerState);
        state.events.push(action.payload);
      })
      .addCase(deleteEvent, (state, action) => {
        pushHistory(state as SchedulerState);
        state.events = state.events.filter((e) => String(e.id) !== String(action.payload));
      })
      .addCase(updateEvent, (state, action) => {
        pushHistory(state as SchedulerState);

        const index = state.events.findIndex((e) => String(e.id) === String(action.payload.id));
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...action.payload };
        }
      });
  },
});

export const { undo, redo, setCurrentDate, setView, updateConfig } = schedulerSlice.actions;
export default schedulerSlice.reducer;
