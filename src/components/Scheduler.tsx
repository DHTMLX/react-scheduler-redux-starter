import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactScheduler from "@dhtmlx/trial-react-scheduler";
import "@dhtmlx/trial-react-scheduler/dist/react-scheduler.css";
import Toolbar from "./Toolbar";
import { redo, setCurrentDate, setView, undo, updateConfig } from "../redux/schedulerSlice";
import { createEvent, updateEvent, deleteEvent, dispatchAction } from "../redux/actions";
import type { AppDispatch, RootState } from "../redux/store";
import type { SchedulerEvent, SchedulerView } from "../redux/types";

export default function ReactSchedulerReduxDemo() {
  const dispatch = useDispatch<AppDispatch>();
  const { past, future, events, view, currentDate, config } = useSelector((s: RootState) => s.scheduler);
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const activeDate = useMemo(() => new Date(currentDate), [currentDate]);
  const isReadOnly = Boolean((config as { readonly?: unknown }).readonly);

  const handleDateNavigation = useCallback((action: "prev" | "next" | "today") => {
    if (action === "today") {
      dispatch(setCurrentDate(Date.now()));
      return;
    }

    const step = action === "next" ? 1 : -1;
    const date = new Date(activeDate);

    if (view === "day") {
      date.setDate(date.getDate() + step);
    } else if (view === "week") {
      date.setDate(date.getDate() + step * 7);
    } else {
      date.setMonth(date.getMonth() + step);
    }
    dispatch(setCurrentDate(date.getTime()));
  }, [activeDate, view, dispatch]);

  // Scheduler <-> Redux data bridge
  const dataBridge = useMemo(() => ({
    save: (entity: string, action: string, payload: unknown, id: unknown) => {
      if (entity !== "event") return;

      switch (action) {
        case "update": {
          const eventData = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
          const eventId = (eventData as Record<string, unknown>).id ?? id;
          if (eventId == null) {
            console.warn("Update called without an id", { payload, id });
            return;
          }

          const eventWithId = { ...eventData, id: eventId } as Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">;
          return dispatchAction(dispatch, updateEvent, eventWithId);
        }
        case "create":
          return dispatchAction(dispatch, createEvent, payload as Omit<Partial<SchedulerEvent>, "id">);
        case "delete": {
          const deleteId =
            payload && typeof payload === "object"
              ? (payload as Record<string, unknown>).id ?? id
              : payload ?? id;
          if (deleteId == null) {
            console.warn("Delete called without an id", { payload, id });
            return;
          }
          return dispatchAction(dispatch, deleteEvent, deleteId as SchedulerEvent["id"]);
        }
        default:
          console.warn(`Unknown action: ${action}`);
          return;
      }
    },
  }), [dispatch]);

  const handleViewChange = useCallback(
    (mode: string, date: Date) => {
      const nextView: SchedulerView = mode === "day" || mode === "week" || mode === "month" ? mode : "month";
      dispatch(setView(nextView));
      dispatch(setCurrentDate(date.getTime()));
    },
    [dispatch]
  );

  const handleSetView = useCallback((nextView: SchedulerView) => dispatch(setView(nextView)), [dispatch]);

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);
  const handleReadOnlyChange = useCallback(
    (value: boolean) => dispatch(updateConfig({ readonly: value })),
    [dispatch]
  );
  const memoizedXY = useMemo(() => ({ nav_height: 0 }), []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar
        currentView={view}
        currentDate={activeDate}
        isReadOnly={isReadOnly}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNavigate={handleDateNavigation}
        onReadOnlyChange={handleReadOnlyChange}
        setView={handleSetView}
      />

      <ReactScheduler
        events={events}
        view={view}
        date={activeDate}
        xy={memoizedXY} /* hide built-in navbar */
        config={config}
        data={dataBridge}
        onViewChange={handleViewChange}
      />
    </div>
  );
}
