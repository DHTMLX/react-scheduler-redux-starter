import { Provider } from "react-redux";
import { store } from "./redux/store";
import Scheduler from "./components/Scheduler";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Scheduler />
    </Provider>
  );
}

export default App;
