import React, { useEffect, useState, useRef } from "react";
import { Table, Select, Space, Tooltip, Alert, Modal, Input, Button, Dropdown, Menu, Checkbox, Row, Col } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate,useParams } from 'react-router-dom';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, MinusCircleOutlined, MenuUnfoldOutlined, SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import "./model.css";
import 'react-phone-input-2/lib/style.css';

const Relation = () => {
    const [compagnies, setCompagnies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pointventeId } = useParams();

    useEffect(() => {
        const fetchActiveCompagnies = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8080/api/v1/relationcp/activeByPointventeId/${pointventeId}`);
                setCompagnies(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des compagnies actives :", error);
                setLoading(false);
            }
        };

        fetchActiveCompagnies();
    }, [pointventeId]);

    const columns = [
        {
            title: 'Raison sociale',
            dataIndex: 'raison_social',
            key: 'raison_social',
        },
        {
            title: 'Date Début',
            dataIndex: 'dateDebut',
            key: 'dateDebut',
            render: (text) => (text ? moment(text).format('YYYY-MM-DD') : ''),
        },
        {
            title: 'Date Fin',
            dataIndex: 'dateFin',
            key: 'dateFin',
            render: (text) => (text ? moment(text).format('YYYY-MM-DD') : ''),
        },
        {
            title: 'Statut',
            dataIndex: 'active',
            key: 'active',
            render: (text, record) => (
                <span style={{ fontWeight: 'bold', color: text ? 'green' : 'red' }}>
                    {text ? 'En cours' : 'Terminée'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    {/* Ajoutez ici les actions nécessaires */}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={compagnies.map((item) => ({ ...item, key: item.id }))}
            loading={loading}
            pagination={false}
        />
    );
};
export default Relation;
