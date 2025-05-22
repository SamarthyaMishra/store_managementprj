// // src/pages/CreateSaleBill.js
// import React from "react";
// import CreateBill from "../components/CreateBill.jsx";


// export default function CreateSaleBill() {
//   return <CreateBill type="sale" />;
// }

import React from "react";
import { useNavigate } from 'react-router-dom';
import CreateBill from "../Component/SaleBill";  // No need for .jsx

export default function CreateSaleBill() {
  return <CreateBill type="sale" />;
}

