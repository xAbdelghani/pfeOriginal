import React, { useState, useEffect, useRef } from "react";
import { Table, Tag, Space, Tooltip, Modal, Alert, Input } from "antd";

import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
    BorderInnerOutlined,
    MinusSquareOutlined,
    FormOutlined,

} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const Fonctions = () => {
  const [fonctions, setFonctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Load();
  }, []);

  async function Load() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/fonction/getall");
    setFonctions(result.data);
    console.log(result.data);
  }

  async function editFonction(fonction) {
    navigate("/admin/EditFo", { state: { fonction } });
  }

  async function DeleteFonction(fonctionid) {
    await axiosInstance.delete("http://localhost:8080/api/v1/fonction/delete/" + fonctionid); 
    Load();
  }

  const columns = [
    {
      title: <span style={{ color: '#607AD6' }}>Caractéristique</span>,
      dataIndex: "qualite",
      key: "qualite",
    },

    {

      title: <span style={{ color: '#607AD6' }}>  Actions  </span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
     
          <Tooltip title="Modifier">
                        <span className="compagnie-bg" onClick={() => editFonction(record)}>
                            <FormOutlined style={{ color: '#228B22' }} />
                        </span>
                    </Tooltip>
    
          <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => DeleteFonction(record.id)}>
                            <MinusSquareOutlined style={{ color: '#DC143C' }} />
                        </span>
                    </Tooltip>
          
        </Space>

      ),
    },
  ];

  return (
    <>

<div className="container">
            
            <br />
            <div className="row justify-content-end">
                <div className="col-lg-2">
                    <Link to="/admin/createfo">
                        <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff' ,marginLeft:"50%",backgroundColor:"rgba(96, 122, 214, 0.70)"}}>
                            <BorderInnerOutlined style={{ color: '#ffffff' }} /> AJOUTER
                           
                        </span>
                    </Link>
                </div>
            </div>
  
        <br />
     


        <Table
          columns={columns}
          dataSource={fonctions.map((fonction) => ({ ...fonction, key: fonction.id }))}
          pagination={{ pageSize: 5 }} 
           size="small"
        />
      </div>
    </>
  );
};

export default Fonctions;
