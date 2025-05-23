import React, { useState, useRef,useEffect } from "react";
import { Table, Dropdown, Menu, Checkbox, Input, Button, Space } from "antd";
import { SearchOutlined, SettingOutlined,CloudDownloadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axiosInstance from "../../core/axiosConfig";

const Facturec = ({ factures }) => {
  const [selectedColumnsFactures, setSelectedColumnsFactures] = useState(['typef', 'date_debutt', 'taxe', 'prime', "date_Echeance",'date_reglement','statut','download']);
  const [columnSelectionMenuVisibleFactures, setColumnSelectionMenuVisibleFactures] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [companyDetails, setCompanyDetails] = useState({
  
    soldePrepayeDto: [],
    
   
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

  const columnSelectionMenuFactures = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsFactures} onChange={(checkedValues) => setSelectedColumnsFactures(checkedValues)}>
          <Checkbox value="typef">Type</Checkbox>
          <Checkbox value="date_debutt">Date Debut</Checkbox>
          <Checkbox value="taxe">Taxe</Checkbox>
          <Checkbox value="prime">Prime</Checkbox>
          <Checkbox value="date_Echeance">Date Echeance</Checkbox>
          <Checkbox value="date_reglement">Date reglement</Checkbox>
          <Checkbox value="statut">Statut</Checkbox>
          <Checkbox value="download">Télécharger</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsFactures = [
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
      },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuFactures} trigger={['click']} visible={columnSelectionMenuVisibleFactures} onVisibleChange={setColumnSelectionMenuVisibleFactures}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigFactures = columnsFactures.filter(column => selectedColumnsFactures.includes(column.key) || column.key === 'settings');

  return (
    <Table 
      columns={selectedColumnsConfigFactures} 
      dataSource={companyDetails.factureDto} 
      rowKey="id" 
      pagination={{pageSize: 25 }} 
      
      size="small" 
    />
  );
};

export default Facturec;
