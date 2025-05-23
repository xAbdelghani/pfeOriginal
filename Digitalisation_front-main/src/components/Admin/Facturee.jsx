import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../core/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Space, Button, Input, Tag,Tooltip } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CloudDownloadOutlined, PlusSquareOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { compagnieId } = useParams();

  useEffect(() => {
    Load();
  }, [compagnieId]);

  async function Load() {
    const result = await axiosInstance.get(`http://localhost:8080/api/v1/facture/getall/${compagnieId}`);
    setFactures(result.data);
    console.log(result.data);
  }

  async function editFacture(facture) {
    navigate(`/admin/modifier-facture/${compagnieId}`, { state: { facture } });
  }

  async function DeleteFacture(factureid) {
    await axiosInstance.delete(`http://localhost:8080/api/v1/facture/delete/${factureid}`);
    Load();
  }

  async function downloadFacture(factureId) {
    const response = await axiosInstance.get(`http://localhost:8080/api/v1/facture/download/${factureId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture_${factureId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
 
  const columns = [
    {
      title: <span style={{ color: '#607AD6' }}>Date</span>,
      dataIndex: "date_Debutt",
      key: "date_Debutt",
      ...getColumnSearchProps('date_Debutt'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Type Facture</span>,
      dataIndex: "typef",
      key: "typef",
      ...getColumnSearchProps('typef'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Taxe</span>,
      dataIndex: "taxe",
      key: "taxe",
      ...getColumnSearchProps('taxe'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Prime</span>,
      dataIndex: "prime",
      key: "prime",
      ...getColumnSearchProps('prime'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Date Échéance</span>,
      dataIndex: "date_Echeance",
      key: "date_Echeance",
      ...getColumnSearchProps('date_Echeance'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Régle le</span>,
      dataIndex: "date_Reglement",
      key: "date_Reglement",
      ...getColumnSearchProps('date_Reglement'),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Télécharger</span>,
      key: "download",
      render: (text, record) => (
        <Button type="primary" onClick={() => downloadFacture(record.id)} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <CloudDownloadOutlined /> Télécharger
        </Button>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Statut</span>,
      dataIndex: "statut",
      key: "statut",
      render: (text) => (
        <Tag color={text.toUpperCase() === 'PAYE' ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Actions</span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">


          <Tooltip title="Modifier">
            <span className="compagnie-bg" onClick={() => editFacture(record)}>
              <EditOutlined style={{ color: '#607AD6' }} />
            </span>
          </Tooltip>

          <Tooltip title="Supprimer">
            <span className="compagnie-bg" onClick={() => DeleteFacture(record.id)}>
              <DeleteOutlined style={{ color: '#607AD6' }} />
            </span>
          </Tooltip>

        </Space>


      ),
    },
  ];

  return (
    <div className="container">
      <br />
      <div className="row justify-content-end">
        <div className="col-lg-2">

          <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff' }} onClick={() => navigate(`/admin/ajouter-facture/${compagnieId}`)}>
            <PlusSquareOutlined style={{ color: '#ffffff' }} /> AJOUTER

          </span>

        </div>
      </div>

      <br />
      <Table
        columns={columns}
        dataSource={factures.map((facture) => ({ ...facture, key: facture.id }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Factures;
