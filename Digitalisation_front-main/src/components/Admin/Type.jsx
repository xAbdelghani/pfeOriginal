import React, { useState, useEffect, useRef } from "react";
import { Table, Tag, Space, Tooltip, Modal, Alert, Input } from "antd";

import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
    MinusSquareOutlined,
    PlusSquareOutlined,
    FormOutlined,

} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';


const Types = () => {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    Load();
  }, []);

  async function Load() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/type/getall");
    setTypes(result.data);
    console.log(result.data);
  }

  async function editType(type) {
    navigate("/admin/Editty", { state: { type } });
  }

  async function DeleteType(typeid) {
    await axiosInstance.delete("http://localhost:8080/api/v1/type/delete/" + typeid); 
    Load();
  }

  const columns = [
    {
      title: <span style={{ color: '#607AD6' }}>Type</span>,
      dataIndex: "typee",
      key: "typee",
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      ellipsis: true,
    },
    

    {

      title: <span style={{ color: '#607AD6' }}>  Actions  </span>,
      key: "actions",
      render: (text, record) => ( 
        
        <Space size="middle">

          <Tooltip title="Modifier">
                        <span className="compagnie-bg" onClick={() => editType(record)}>
                            <FormOutlined style={{ color: '#228B22' }} />
                        </span>
                    </Tooltip>
          <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => DeleteType(record.id)}>
                            <MinusSquareOutlined style={{ color: '#DC143C' }} />
                        </span>
                    </Tooltip>
          
        </Space>

      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];
  const handleResize = () => {
    // Manipulations pour gérer le redimensionnement de votre tableau en fonction de la taille de l'écran
    // Vous pouvez mettre à jour l'état ou effectuer d'autres actions nécessaires ici
  };

  return (
    <>

      <div className="container">
            
            <br />
            <div className="row justify-content-end">
                <div className="col-lg-2">
                    <Link to="/admin/createty">
                        <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff',marginLeft:"50%",backgroundColor:"rgba(96, 122, 214, 0.70)" }}>
                            <PlusSquareOutlined style={{ color: '#ffffff' }} /> AJOUTER
                           
                        </span>
                    </Link>
                </div>
            </div>
  
        <br />
     


        <Table
          columns={columns}
          dataSource={types.map((type) => ({ ...type, key: type.id }))}
          pagination={{ pageSize: 5 }} // Définir la taille de la page du tableau
          size="small"
        />
        
      </div>
    </>
  );
};

export default Types;
