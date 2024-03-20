import { useState } from "react";
import { useAlert } from "react-alert";
import Swal from "sweetalert2";
import { ReactSweetAlert } from "sweetalert2-react-content";
import "./App.css";
import ContentEditor from "./ContentEditor";

interface AppProps {
  Swal: typeof Swal & ReactSweetAlert;
}

const App: React.FC<AppProps> = ({ Swal }) => {
  const alert = useAlert();
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selRowText, setSelRowText] = useState();
  const maker = "jeong";

  return (
    <div className="App">
      {loading && <div>loading...</div>}
      <button onClick={() => setShowEditor((state) => !state)}>toggle</button>
      {showEditor && (
        <ContentEditor
          // viewOnly={true}
          Swal={Swal}
          alert={alert}
          setLoading={setLoading}
          maker={maker}
          data={selRowText}
          onClose={(goRefresh = false) => {
            setShowEditor(false);
          }}
          onSave={(type, saveObject) => {
            return new Promise((resolve, reject) => {
              console.log("type", type);
              console.log("saveObject", saveObject);
              setTimeout(() => resolve({ valid: true, msg: "success" }), 2000);
            });
          }}
          onDelete={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => resolve({ valid: true, msg: "success" }), 2000);
            });
          }}
        />
      )}
    </div>
  );
};

export default App;
