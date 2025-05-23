import React, { useState, useRef, useEffect } from "react";
import { Table, Dropdown, Menu, Checkbox, Input, Button, Space, Modal, message } from "antd";
import { SearchOutlined, SettingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axiosInstance from "../../core/axiosConfig";

const Autorise = ({ autorises }) => {
  const [selectedColumnsAutorises, setSelectedColumnsAutorises] = useState(['libelle', 'flag']);
  const [columnSelectionMenuVisibleAutorises, setColumnSelectionMenuVisibleAutorises] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [companyDetails, setCompanyDetails] = useState({ attestationsAutoriseesDto: [] });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  const columnSelectionMenuAutorises = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsAutorises} onChange={(checkedValues) => setSelectedColumnsAutorises(checkedValues)}>
          <Checkbox value="libelle">Types d'attestations</Checkbox>
          <Checkbox value="flag">Autorisé</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsAutorises = [
    {
      title: 'Type',
      dataIndex: 'libelle',
      key: 'libelle',
      ...getColumnSearchProps('libelle'),
    },
    {
      title: 'Autorisé',
      dataIndex: 'flag',
      key: 'flag',
      render: (flag, record) => (
        <span 
          style={{ color: flag ? 'green' : 'red', cursor: 'pointer' }} 
          onClick={() => handleIconClick(record)}
        >
          {flag ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        </span>
      ),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuAutorises} trigger={['click']} visible={columnSelectionMenuVisibleAutorises} onVisibleChange={setColumnSelectionMenuVisibleAutorises}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const handleIconClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const description = `Raison sociale: ${companyDetails.raison_social}, Libellé: ${selectedRecord.libelle}`;
    axiosInstance.post('http://localhost:8080/api/v1/notification/save', {
      messagen: 'Demande d\'autorisation de type d\'attestation',
      description: description,
      read: false,
      timestamp: new Date(),
    })
    .then(() => {
      message.success('Notification envoyée avec succès');
      setIsModalVisible(false);
    })
    .catch(error => {
      message.error('Erreur lors de l\'envoi de la notification');
      console.error('Erreur lors de l\'envoi de la notification', error);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const selectedColumnsConfigAutorises = columnsAutorises.filter(column => selectedColumnsAutorises.includes(column.key) || column.key === 'settings');

  return (
    <>
      <Table 
        columns={selectedColumnsConfigAutorises} 
        dataSource={companyDetails.attestationsAutoriseesDto} 
        rowKey="id" 
        pagination={{ pageSize: 8 }} 
        size="small" 
      />
      <Modal
        title="Demande d'autorisation d'attestation"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Envoyer"
        cancelText="Annuler"
      >
        <p>Voulez-vous envoyer une demande d'autorisation pour ce type d'attestation ?</p>
      </Modal>
    </>
  );
};

export default Autorise;
