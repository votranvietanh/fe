import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button } from 'react-bootstrap';

import UpdateBtn from '../PaperComponent/Update';
import Navbar from "../Header/Header";
// import DisplayInfor from "../Components/DisplayInfor";
import { DetailAdvanced, DetailInfor, DetailWorking, DetailStatic, DetailAvatar } from "./index";
import authHeader from "../services/auth-header";
import AuthService from "../services/auth.service";


function DetailUser(props) {
    const { id } = useParams();
    const currentUser = AuthService.getCurrentUser();
    const [newEmployee, setNewEmployee] = useState({

        name: "",
        email: "",
        phone: "",
        address: "",
        mph: "",
        date: "",
        nameTeam: "",
        age: "",
        gender: "",
        photo: "",
        workTimeList: [],
        advanceList: []
    });

    const { name, gender, phone, address, mph, age, date, nameTeam,roles } = newEmployee;


    useEffect(() => {
        getDataUser();
    }, [id]);

    const urlPhoto = newEmployee.photo ? `http://localhost:8080/${newEmployee.photo}` : null;


    const getDataUser = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/users/user/${id}`, { headers: authHeader() });
            const { data } = result;
            setNewEmployee(data);       
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteUser = async (id) => {
        await axios.delete(`http://localhost:8080/users/user/${id}`, { headers: authHeader() })
            .then(response => {
                console.log('Deleted item:', response.data);
                alert('Deleted employee successfully!');
                window.location = 'http://localhost:3000/admin';
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    }
    return (<div>
        <Navbar />
        <div className="border-bottom mb-3">
            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ justifyContent: 'flex-start' , margin:'30px 0px' }}>{name}</h1>
                <div style={{ justifyContent: 'flex-end' }}>
                    
                    {currentUser?.roles.includes("ROLE_ADMIN") &&
                        <Button onClick={() => handleDeleteUser(id)} variant="light" style={{ textAlign: 'center' }} >
                            <img src="/DeleteIcon.svg" alt="delete-icon" />
                        </Button>
                    }

                    <Button variant="light" style={{ textAlign: 'center' }}>
                        <UpdateBtn onClick={getDataUser}/>
                    </Button>

                </div>
            </div>
        </div>
        <div className="container">
            <div className="row d-flex justify-content-center">
                <DetailAvatar
                    Role={roles && roles[0] && roles[0].name ? roles[0].name : 'ROLE_USER'}
                    Age={age}
                    Gender={gender ? 'Male' : 'Female'}
                    No={id}
                    PhoneNumber={phone}
                    UrlPhoto={urlPhoto}
                    className="col-3" />
                <div className="col-8">
                    <Tabs style={{fontSize: "18px"}}
                        defaultActiveKey="detail-infor"
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="detail-infor" title="INFORMATIONS" >
                            <DetailInfor date={date} team={nameTeam} address={address} mph={mph} />
                        </Tab>
                        <Tab eventKey="detail-working" title="WORKING">
                            <DetailWorking />
                        </Tab>
                        <Tab eventKey="detail-advanced" title="ADVANCED">
                            <DetailAdvanced />
                        </Tab>
                        <Tab eventKey="detail-static" title="STATICS">
                            <DetailStatic mph={mph}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>

        </div>
    </div >
    );
}

export default DetailUser;