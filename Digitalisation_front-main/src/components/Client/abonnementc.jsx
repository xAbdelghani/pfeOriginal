// src/components/Abonnement.jsx
import React, { useState, useRef,useEffect } from "react";
import { Table, Dropdown, Menu, Checkbox, Input, Button, Space } from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axiosInstance from "../../core/axiosConfig";

const Abonnementc = ({ abonnements }) => {
  const [selectedColumnsAbonnements, setSelectedColumnsAbonnements] = useState(['libelle', 'date_Abonnement', 'date_Fin', 'montant', "actions"]);
  const [columnSelectionMenuVisibleAbonnements, setColumnSelectionMenuVisibleAbonnements] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [companyDetails, setCompanyDetails] = useState({
  
    abonnement: [],
    
   
  });
  useEffect(() => {
    
  const companyId = localStorage.getItem('companyId');
  if (companyId) {
    axiosInstance.get(`http://localhost:8080/api/v1/compagnie/${companyId}`)
      .then(response => {
        setCompanyDetails(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails de la compagnie', error);
      });
  }
}, []);
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

  const columnSelectionMenuAbonnements = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsAbonnements} onChange={(checkedValues) => setSelectedColumnsAbonnements(checkedValues)}>
          <Checkbox value="libelle">Type</Checkbox>
          <Checkbox value="date_Abonnement">Date début</Checkbox>
          <Checkbox value="date_Fin">Date fin</Checkbox>
          <Checkbox value="montant">Montant abonnement</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsAbonnements = [
    {
      title: 'Type',
      dataIndex: 'libelle',
      key: 'libelle',
      ...getColumnSearchProps('libelle'),
    },
    {
      title: 'Date début',
      dataIndex: 'date_Abonnement',
      key: 'date_Abonnement',
      ...getColumnSearchProps('date_Abonnement'),
    },
    {
      title: 'Date fin',
      dataIndex: 'date_Fin',
      key: 'date_Fin',
      ...getColumnSearchProps('date_Fin'),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      ...getColumnSearchProps('montant'),
      render: (montant, record) => (
        <span>
            {montant !== null ? montant.toFixed(2) : 'N/A'} {record.devise}
        </span>
    ),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuAbonnements} trigger={['click']} visible={columnSelectionMenuVisibleAbonnements} onVisibleChange={setColumnSelectionMenuVisibleAbonnements}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigAbonnements = columnsAbonnements.filter(column => selectedColumnsAbonnements.includes(column.key) || column.key === 'settings');

  return (
    <Table 
      columns={selectedColumnsConfigAbonnements} 
      dataSource={companyDetails.abonnement} 
      rowKey="id" 
      pagination={{pageSize: 25 }}  
   
      size="small" 
    />
  );
};

export default Abonnementc;
