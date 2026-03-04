# DHTMLX React Scheduler - Redux Toolkit Demo

This demo shows how to use **DHTMLX React Scheduler** with **Redux Toolkit**.
It focuses on wiring the Scheduler to a single Redux store: the Scheduler UI edits events, Redux stores them, and a small toolbar (Material UI) controls navigation, view switching, and undo/redo.


## Features

- Day/week/month views
- Custom toolbar (Material UI) for navigation and view switching
- Create/update/delete events via the Scheduler UI, stored in Redux Toolkit
- Toggle Scheduler read-only mode via Redux-managed `config`
- Snapshot-based undo/redo for event and config changes

## Requirements
- Node.js: **20.19+** (required by Vite 7)
- Package manager: **npm**

## Quick start

### 1) Install
```bash
# clone
git clone <repo-url>
cd <repo-folder>

# install
npm install
```

### 2) Run
```bash
npm run dev
```

Open: http://localhost:5173

## Project structure
- `src/components/Scheduler.tsx` – Scheduler initialization + Scheduler↔Redux data bridge
- `src/components/Toolbar.tsx` – toolbar UI (view buttons, navigation, undo/redo)
- `src/redux/schedulerSlice.ts` – Scheduler state + snapshot-based undo/redo
- `src/redux/actions.ts` – event create/update/delete action creators
- `src/seed/data.ts` – initial seed events/date/view

## Scripts
- `dev` – run the app locally
- `build` – build for production
- `preview` - preview the production build locally

## License

Source code in this repo is released under the **MIT License**.

**DHTMLX React Scheduler** is a commercial library - use it under a valid [DHTMLX license](https://dhtmlx.com/docs/products/licenses.shtml) or evaluation agreement.

## Useful links

[DHTMLX React Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/)

[DHTMLX Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler/)

[Documentation](https://docs.dhtmlx.com/scheduler/)

[React Scheduler Documentation](https://docs.dhtmlx.com/gantt/integrations/react/)

[Blog](https://dhtmlx.com/blog/)

[Forum](https://forum.dhtmlx.com/)