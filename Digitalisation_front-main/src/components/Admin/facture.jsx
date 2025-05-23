import React, { useState, useEffect, useRef } from "react";
import { Table, Tag, Space, Button, Modal, Alert, Input } from "antd";

import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FileAddOutlined,
  EditOutlined,
  UserDeleteOutlined,
  CloudDownloadOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Load();
  }, []);

  async function Load() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/facture/getall");
    setFactures(result.data);
    console.log(result.data);
  }

  async function editFacture(facture) {
    navigate("/EditA", { state: { facture } });
  }

  async function DeleteFacture(factureid) {
    await axiosInstance.delete("http://localhost:8080/api/v1/attestation/delete/" + factureid); 
    Load();
  }

  const columns = [
    {
      title: <span style={{ color: '#607AD6' }}>Date</span>,
      dataIndex: "date_debutt",
      key: "date_debutt",
    },
    {
      title: <span style={{ color: '#607AD6' }}>Type Facture</span>,
      dataIndex: "typef",
      key: "typef",

    },
    {
      title: <span style={{ color: '#607AD6' }}>Taxe</span>,
      dataIndex: "taxe",
      key: "taxe",
    },
    {
      title: <span style={{ color: '#607AD6' }}>Prime</span>,
      dataIndex: "prime",
      key: "prime",
    },
    {
        title: <span style={{ color: '#607AD6' }}>Date_Echeance</span>,
        dataIndex: "date_Echeance",
        key: "date_Echeance",
      },
      {
        title: <span style={{ color: '#607AD6' }}>Régle_le</span>,
        dataIndex: "date_reglement",
        key: "date_reglement",
      },
      {
        title: <span style={{ color: '#607AD6' }}>Télécharger</span>,
        key: "download",
        render: (text, record) => (
          <Button type="primary">
            <CloudDownloadOutlined /> Télécharger
          </Button>
        ),
      },
    {
      title: <span style={{ color: '#607AD6' }}>Statut</span>,
      dataIndex: "statut",
      key: "statut",
   
      render: (text) => (
        <Tag color={text.toUpperCase() === 'PAYÉ' ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },

  ];

  return (
    <>

<div className="container">
            
            <br />
            
  
        <br />
     


        <Table
          columns={columns}
          dataSource={factures.map((facture) => ({ ...facture, key: facture.id }))}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
};

export default Facture;
