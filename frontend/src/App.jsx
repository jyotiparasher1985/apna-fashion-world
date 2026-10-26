import "./App.css";
import AllRoutes from "./Routes/AllRoutes";
import Footer from "./component/Footer/Footer";
import Chatbot from "./component/Chatbot/Chatbot";
function App() {
  return (
    <div className="App">
      <AllRoutes />
      <Footer/>
      <Chatbot />
    </div>
  );
}


export default App;
