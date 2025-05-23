import React from "react";
import { Button, Modal, Input, DatePicker } from "antd";

const SubTableHeader = ({
    modalVisible,
    setModalVisible,
    companyName,
    setCompanyName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleSave
}) => (
    <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
            Ajouter une Compagnie
        </Button>
        <Modal
            title="Ajouter une Compagnie"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
                <Button key="back" onClick={() => setModalVisible(false)}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave}>
                    Sauvegarder
                </Button>,
            ]}
        >
            {/* Form pour saisir les détails de la compagnie */}
            <Input placeholder="Nom de la Compagnie" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <DatePicker placeholder="Date de Début" value={startDate} onChange={(date) => setStartDate(date)} />
            <DatePicker placeholder="Date de Fin" value={endDate} onChange={(date) => setEndDate(date)} />
        </Modal>
    </div>
);

export default SubTableHeader;
