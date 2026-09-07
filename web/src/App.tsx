import { BrowserRouter, Route, Routes } from "react-router-dom";
import Administration from "./administration/Home";
import Citizen from "./citizen/Home";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Citizen />} />
      <Route path="/administration" element={<Administration />} />
    </Routes>
    </BrowserRouter>
  )
}