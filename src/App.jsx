import { Route, Routes } from "react-router-dom";
import Blog from "./page/Blog";
import Dash from "./page/Dash";
import Home from "./page/Home";
import Login from "./page/Login";
import Registration from "./page/Registration";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/registration" element={<Registration />}></Route>
        <Route path="/dashboard" element={<Dash />}></Route>
        <Route path="/post" element={<Blog />}></Route>
        <Route path="/post/:postid" element={<Blog />}></Route>
      </Routes>
    </>
  );
};

export default App;
