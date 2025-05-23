import React from 'react';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const ContactInfo = () => {
    return (
        <div className="custom-border" style={{ width: '100%'  }}>
            <div style={{ marginTop: '-14%'}}>
            <div style={{ display: 'flex' }}>
                <EnvironmentOutlined style={{ color: '#607AD6', fontSize: '30px', marginRight: '10%',marginLeft:'-15%'  }} />
                <div>
                    <h4 style={{ color: 'rgba(0, 0, 0, 0.52)',backgroundColor:"white" }}>
                        <br />
                        Sec.13,20, Av.Mohamed Al Yazidi, Hay Riad Rabat
                    </h4>
                </div>
            </div>
            <br/>
            <div style={{ display: 'flex', padding: '1%' }}>
                <PhoneOutlined style={{ color: '#607AD6', fontSize: '30px', marginRight: '12%',marginLeft:'-18%' }} />
                <div>
                    <h4 style={{ color: 'rgba(0, 0, 0, 0.52)',backgroundColor:"white" }}>
                        <br />
                        +212 537 67 0269
                    </h4>
                </div>
            </div>
            <br/>
            <div style={{ display: 'flex', padding: '1%' }}>
                <MailOutlined style={{ color: '#607AD6', fontSize: '30px', marginRight: '12%',marginLeft:'-18%' }} />
                <div>
                    <h4 style={{ color: 'rgba(0, 0, 0, 0.52)',backgroundColor:"white" }}>
                        <br />
                        orsys@orsys.co.ma
                    </h4>
                </div>
            </div>
           
        </div>
        </div>
    );
};

export default ContactInfo;
