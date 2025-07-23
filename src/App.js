import logo from "./logo.svg";
import "./App.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import AppRouter from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

function App() {
  return (
    <Provider store={store}>
      {/* <div>welcome Jay!</div> */}
      <AppRouter />
    </Provider>
  );
}

export default App;
