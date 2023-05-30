import axios from 'axios';
import { useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import UpdateBtn from '../PaperComponent/Update';
import authHeader from '../services/auth-header';
import AuthService from '../services/auth.service';


function DisplayInfor(props) {
    const { id } = useParams();
    // const navigator = useNavigate()
    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const [serverData, setServerData] = useState({
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
    
    const { name, gender, phone, address, mph, age, date, nameTeam, photo, workTimeList, advanceList } = serverData;
    const currentUser = AuthService.getCurrentUser();
    const handleDeleteUser = async (id) => {
        await axios.delete(`http://localhost:8080/users/user/${id}`, { headers: authHeader() })
            .then(response => {
                console.log('Deleted item:', response.data);
                alert('Deleted employee successfully!');
                window.location = 'http://localhost:3000/';
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    }
    const [tableData, setTableData] = useState([]);

    const updateTableData = (data) => {
        setTableData(data);
    };
    useEffect(() => {
        fetchServerData();
    }, [tableData]);

    const fetchServerData = () => {
        fetch(`http://localhost:8080/users/user/${id}`, { headers: authHeader() })
            .then((response) => response.json())
            .then((data) => {
                setServerData(data);
                console.log(data)
            });
    };
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: `space-between`,
                alignItems: `center`
            }}>

            <h1 style={{ justifyContent: 'flex-start' }} >{name}</h1>
            <div style={{ justifyContent: 'flex-end' }}>

                {/* MODAL WHEN CLICK DELETE BUTTON  */}

                {currentUser?.roles.includes("ROLE_ADMIN") &&
                    <Button onClick={() => handleDeleteUser(id)} variant="light" style={{ textAlign: 'center' }} >
                        <img src="/DeleteIcon.svg" alt="delete-icon" />
                    </Button>
                }

                {/* // MODEL KHI CLICK UPDATE BUTTON  */}
                <Button variant="light" style={{ textAlign: 'center' }}>
                    <UpdateBtn updateTableData={fetchServerData} />
                </Button>

            </div>
        </div>
    );
}

export default DisplayInfor;