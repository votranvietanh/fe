import React from 'react'
import * as yup from 'yup';
import axios from 'axios';
import { TextField } from '@mui/material';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { useState, useEffect } from "react";


import '../Styles/TableUser.css'
import MyVerticallyCenteredModal from '../modal/MyVerticallyCenteredModal';
import { Button, Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import authHeader from '../services/auth-header';
import AuthService from '../services/auth.service';
import "bootstrap/dist/css/bootstrap.min.css";
import AddSearchBar from '../modal/AddSearchBar'
import CalculateSalary from '../PaperComponent/CalculateSalary';

function DetailAdvances(props) {
    const [data, setData] = useState([])
    const { id } = useParams();
    const [modalShow, setModalShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [filteredWorkingDates, setFilteredWorkingDates] = useState([]);

    const [newAdvances, setNewAdvances] = useState({ date: "", money: "" });
    const { date, money } = newAdvances;
    const [modalShowUpdate, setModalShowUpdate] = useState(false);

    //select month
    const [isLoading, setIsLoading] = React.useState(false)

    //update
    const currentUser = AuthService.getCurrentUser();

    const validationSchema =
        yup.object().shape({
            date: yup
                .string()
                .required('Date is required')
                .test('unique', 'This date is already taken', function (value) {
                    return !filteredWorkingDates.includes(value);
                }),
            money: yup.number().positive('Money must be positive')
                .required('Money is required'),
        }

        );
    const validationUpdate =
        yup.object().shape({
            money: yup.number().positive('Money must be positive')
                .required('Money is required'),
        }

        );


    const handleDelete = async (rowID) => {
        await axios.delete(`http://localhost:8080/user/advances/${rowID}`, { headers: authHeader() })
        getData(id)
    }

    // consy salary = CalculateSalary()

    const getData = async (id) => {
        await axios.get(`http://localhost:8080/users/user/${id}`, { headers: authHeader() })
            .then(res => {
                const AdvanceList = res.data.advanceList;
                setData(AdvanceList)
                setFilteredWorkingDates(AdvanceList.map((workTime) => workTime.date));

            })
            .catch(err => console.log(err));

    }

    const updateAdvances = async (id, idWork) => {

        try {
            await validationUpdate.validate(newAdvances, { abortEarly: false });
            try {
                setIsLoading(true)
                await axios.put(`http://localhost:8080/user/${id}/advances/${idWork}`, newAdvances, { headers: authHeader() })
                setIsLoading(false)
                setModalShowUpdate(false);
            } catch (error) {
                console.log('Error creating user1:', error.message);
            }
        } catch (error) {
            // Xử lý lỗi khi dữ liệu không hợp lệ
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            console.log(errors);
            console.error('Error creating user2:', error.message);
        }

    }
    useEffect(() => {
        getData(id);
        if (modalShow) { setNewAdvances({ date: "", money: "" }); setErrors({}) }
        if (modalShowUpdate) { setErrors({}) }

    }, [modalShow, modalShowUpdate])
    const [idWork, setIdWork] = useState()

    const getIdData = async (array, id) => {
        setModalShowUpdate(true);
        setIdWork(id)
        const element = array.find(item => item.id === id);
        if (element) {
            setNewAdvances({ date: element.date, money: element.money })
        }
    };

    const editFormatter = (_, row) => {
        return (
            <div className='row'>
                <Button variant="light" className='ml-2  d-flex align-items-center' onClick={() => getIdData(data, row.id)}   >
                    <img src="/EditIcon.svg" alt="edit-icon" />
                </Button>
                <Button variant="light" className='ml-1 d-flex align-items-center' onClick={() => handleDelete(row.id)}   >
                    <img src="/DeleteIcon.svg" alt="delete-icon" />
                </Button>
            </div>
        );
    };
    const idFormatter = (_, __, rowIndex) => {
        const calculateRowNumber = () => {
            let rowNumber;
            if (currentPage !== 1) {
                setCurrentPage(1);
                setSizePerPageList(5);
                rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
                // console.log("Current page: " + currentPage);
            } else {
                setSizePerPageList(5);
                rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
                // console.log("Current page: " + currentPage);
            }
            return rowNumber;
        };

        return <span>{calculateRowNumber()}</span>;
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [sizePerPageList, setSizePerPageList] = useState('');
    const options = {
        sizePerPageList: [{
            text: 5, value: 5
        }, {
            text: 'All', value: data.length
        }],
        onPageChange: page => {
            setCurrentPage(page);
        },
        page: currentPage
    };
    const columns = [
        {
            dataField: 'no',
            text: 'No',
            formatter: idFormatter,
            headerAttrs: { width: 80 },
        },
        {
            dataField: "formattedDate",
            text: "Date",
            formatter: (_, row) => {
                if (row.date) {
                    const parts = row.date.split("-");
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return "";
            },
            sort: true,
            sortMethod: (a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateA - dateB;
            },
        },
        {
            dataField: 'money',
            text: 'Money',
            sort: true,


        },
        {
            dataField: "edit",
            text: "Option",
            sort: false,
            formatter: editFormatter,
            headerAttrs: { width: 115 },
            attrs: { width: 50, className: "EditRow" }
        }
    ];

    const onInputChange = async (e) => {
        setNewAdvances(preAdvances => ({ ...preAdvances, [e.target.name]: e.target.value }))

        try {
            await yup.reach(validationSchema, e.target.name).validate(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));


        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: error.message }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await validationSchema.validate(newAdvances, { abortEarly: false });
            // console.log(newWorkDate)
            try {
                await axios.post(`http://localhost:8080/user/user/${id}/advances`, newAdvances, { headers: authHeader() })
                setModalShow(false);
            } catch (error) {
                console.log('Error creating user1:', error.message);
            }
        } catch (error) {
            // Xử lý lỗi khi dữ liệu không hợp lệ
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            console.log(errors);
            console.error('Error creating user2:', error.message);
        }

    };

    const content =
        <div onSubmit={handleSubmit}
        // style={{width:"350px"}}
        >

            <Form onSubmit={handleSubmit} className='row'>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Payday</Form.Label>
                    <TextField
                        name="date"
                        type="Date"
                        value={date}
                        autoFocus
                        onChange={(e) => onInputChange(e)}

                        error={!!errors.date}
                        helperText={errors.date}
                        required
                        style={{ width: 230 }}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Advances money</Form.Label>
                    <TextField style={{ width: 230 }}
                        InputProps={{
                            startAdornment: <AttachMoneyIcon />,
                        }}
                        name="money"
                        value={money}
                        error={!!errors.money}
                        helperText={errors.money}
                        onChange={(e) => onInputChange(e)}
                        required
                    />

                </Form.Group>
            </Form>
        </div>
    const Update =
        <div onSubmit={handleSubmit}
        // style={{width:"350px"}}
        >

            <Form onSubmit={handleSubmit} className='row'>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Start day</Form.Label>
                    <TextField
                        name="date"
                        type="Date"
                        value={newAdvances.date}
                        autoFocus
                        onChange={(e) => onInputChange(e)}
                        required
                        style={{ width: 230 }}
                        disabled
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Advances money</Form.Label>
                    <TextField style={{ width: 230 }}
                        InputProps={{
                            startAdornment: <AttachMoneyIcon />,
                        }}
                        name="money"
                        value={newAdvances.money}
                        error={!!errors.money}
                        helperText={errors.money}
                        onChange={(e) => onInputChange(e)}
                        required
                    />

                </Form.Group>
            </Form>
        </div>
    return (

        <div className='container'>
            <div className='row mb-2'>
                <div className='col-6 d-flex justify-content-start'>
                    <h1>Advances</h1>

                </div>
                <div className='col-6 d-flex justify-content-end'>
                    {
                        currentUser?.roles.includes("ROLE_ADMIN") &&
                        <Button variant="light" onClick={() => setModalShow(true)}   >
                            <img className='float-end' src="/PlusIcon.svg" alt="plus-icon" />
                        </Button>}
                </div>
            </div>

            <MyVerticallyCenteredModal
                header={'ADD THE ADVANCES '}
                content={content}
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={handleSubmit}
                onClose={() => setModalShow(false)}

            />

            <MyVerticallyCenteredModal

                header={'UPDATE THE WORKING DATE'}
                content={Update}
                show={modalShowUpdate}
                onHide={() => setModalShowUpdate(false)}
                onSubmit={() => updateAdvances(id, idWork)}
                onClose={() => setModalShowUpdate(false)}

            />
            <AddSearchBar Data={data} Options={options} Columns={columns} Placeholder="Search by YYYY-MM-DD" />

        </div>
    )
}



export default DetailAdvances;