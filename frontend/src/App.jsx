import "./App.css";
import AllRoutes from "./Routes/AllRoutes";
import Footer from "./component/Footer/Footer";
import Chatbot from "./component/Chatbot/Chatbot";
import BackgroundMusic from "./component/Music/BackgroundMusic";
function App() {
  return (
    <div className="App">
      <AllRoutes />
      <Footer/>
      <Chatbot />
      <BackgroundMusic />
    </div>
  );
}


export default App;
