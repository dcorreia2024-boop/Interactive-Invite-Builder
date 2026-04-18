import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Switch>
    <Route path="/admin" component={AdminPage} />
    <Route component={App} />
  </Switch>
);
