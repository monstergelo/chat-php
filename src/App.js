import './App.css';
import { useState } from 'react';

const sseurl = 'https://staging.izzibook.co.id/backend/api-nuswapada/cms/chat_log/sse'
const sendurl = 'https://staging.izzibook.co.id/backend/api-nuswapada/cms/chat_log/create'

// const sseurl = 'http://localhost/api-nuswapada/cms/chat_log/sse'
// const sendurl = 'http://localhost/api-nuswapada/cms/chat_log/create'

function App() {
  const [sse, SetSse] = useState(null);
  const [data, setData] = useState([]);

  const [department, setDepartment] = useState('test');
  const [villa_code, setVillaCode] = useState('T0001');
  const [maintenance_no, setMaintenanceNo] = useState('1');
  const [message, setMessage] = useState('');

  const handleChange = (setFunction) => (e) => {
    setFunction(e.target.value)
  }

  const handleSend = () => {
    fetch(sendurl, {
      method: 'POST',
      body: JSON.stringify({
        "department": department,
        "villa_code": villa_code,
        "maintenance_no": maintenance_no,
        "comment": message
      })
    });

    setMessage('')
  }

  //SSE
  const handleConnect = () => {
    if(sse) {
      sse.close();
    }
    let url = new URL(sseurl);
    let params = new URLSearchParams(url.search);

    //Add parameter.
    url.searchParams.append("department", department);
    url.searchParams.append("villa_code", villa_code);
    url.searchParams.append("maintenance_no", maintenance_no);

    const conn = new EventSource(url, {
      heartbeatTimeout: 10 * 60 * 1000,
    });
    function getRealtimeData(data) {
      setData((prev) => (data));
    }
    conn.onmessage = (e) => {
      getRealtimeData(JSON.parse(e.data));
    }
    conn.onerror = (e) => {
      console.log('disconnected')
      setData((prev) => ({
        error: "disconnected",
      }));
      
      conn.close();  
    }
    
    SetSse(conn);
  }
  //==RENDER============================================================
  return (
    <div className="App" style={{height: "100%"}}>
      <div style={{display: "flex", height: "100%", flexDirection: "column-reverse"}}>
        <div style={{width: "100%", height: "100%", border: "solid", margin: "12px"}}>

          {data.map((item) => (
            <p>{JSON.stringify(item)}</p>
          ))}
        </div>

        <div style={{textAlign: "left", width: "100%", height: "100%", border: "solid", margin: "12px", padding: "8px"}}>
          <label for="department">department: </label>
          <input onChange={handleChange(setDepartment)} value={department} type="text" id="department" name="department" /> <br />

          <label for="villa_code">villa_code: </label>
          <input onChange={handleChange(setVillaCode)} value={villa_code} type="text" id="villa_code" name="villa_code" /> <br />

          <label for="maintenance_no">maintenance_no: </label>
          <input onChange={handleChange(setMaintenanceNo)} value={maintenance_no} type="text" id="maintenance_no" name="maintenance_no" /><br />
          <button onClick={handleConnect}>connect</button>

          <br />
          <br />
          <br />
          <label for="message">message: </label>
          <input onChange={handleChange(setMessage)} value={message} type="text" id="message" name="message" />

          <button onClick={handleSend}>send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
