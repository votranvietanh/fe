import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import MyVerticallyCenteredModal from '../modal/MyVerticallyCenteredModal';
import { Button, Form } from 'react-bootstrap';
import authHeader from '../services/auth-header';
import Headers from '../Header/Header';
import { useAddTeam, useGetTeam } from '../api/Team/useTeam.js'

function Team() {
    const [modalShow, setModalShow] = useState(false);
    const [data1, setData1] = useState([])

    const [newNameTeam, setNewNameTeam] = useState({ name: "" });
    const { name } = newNameTeam;

    const addTeam = useAddTeam();
    const { data, isLoading, error } = useGetTeam();

    const [idTeam, setIdTeam] = useState(null);

    const onAddTeam = async (team) => {
        await addTeam.mutateAsync(team);
    }
    const getIdTeam = (idTeam) => {
        setIdTeam(idTeam)
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData1(data?data:[]);

                if (idTeam) {
                    const result2 = await axios.get(`http://localhost:8080/teams/${idTeam}`, { headers: authHeader() });
                    setData2(result2.data.users);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [idTeam]);
    const sexFormatter = (_, row) => row.gender ? "Male" : "Female";

    const editFormatter = (_, row) => (
        <div style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}>
            <img
                onClick={() => getIdTeam(row.id)}
                style={{ paddingRight: 10 }}
                src="/DetailIcon.svg"
                alt="detail-icon"
            />
        </div>
    );
    const idFormatter = (cell, row, rowIndex) => {
        return (
            <div>
                {rowIndex + 1}
            </div>
        )
    }
    const columns1 = [
        {
            dataField: 'no',
            text: 'No',
            sort: true,
            formatter: idFormatter,

        }, {
            dataField: 'name',
            text: 'Name Team'
        },
        {
            dataField: "detail",
            text: "Detail",
            sort: false,
            formatter: editFormatter,
            headerAttrs: { width: 100 },
            attrs: { width: 50, className: "EditRow" }
        }
    ];
    ////////////-------------------------------
    const [data2, setData2] = useState([])



    const columns2 = [
        {
            dataField: 'id',
            text: 'No',
            sort: true,
            key: 'column_0',
        }, {
            dataField: 'name',
            text: 'Full name',
            sort: true,
            key: 'column_1',
        }, {
            dataField: 'phone',
            text: 'Phone',
            key: 'column_2',
        }, {
            dataField: 'address',
            text: 'Address',
            key: 'column_3',
        }, {
            dataField: 'gender',
            formatter: sexFormatter,
            text: 'Sex',
            key: 'column_4',
        }
    ];
    const addData = async () => {
        const response = await onAddTeam
            .then(response => {
                console.log('new Team is created:', response.data);
            })
        setModalShow(false);
    }
    const onInputChange = (e) => {
        setNewNameTeam({ ...newNameTeam, [e.target.name]: e.target.value })
    }
    const content = () => (
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Add new team</Form.Label>
                <Form.Control
                    name="name"
                    value={name}
                    autoFocus
                    onChange={(e) => onInputChange(e)}
                />
            </Form.Group>
        </Form>
    );

    return (
        <div>
            <Headers />
            <div className='container mt-2'>
                <div className='row mb-2'>
                    <div className='col-6 d-flex justify-content-start'>
                        <h1>Team</h1>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <Button
                            variant=""
                            onClick={() => setModalShow(true)}   >
                            <img
                                className='float-end' src="/PlusIcon.svg" alt="plus-icon" />
                        </Button>
                    </div>
                </div>
            </div>
            <MyVerticallyCenteredModal

                header={'ADD THE NEW TEAM'}
                content={content()}
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={() => addData()} />
            <hr
                style={{
                    border: '1px solid #918686'
                }}
            />
            <div className="container">
                <div className="row">
                    <div className="col-4 mr-1">
                        <p>Total {data1.length}  teams</p>
                        <div>
                            <BootstrapTable className="table"
                                keyField='id'
                                data={data?data:[]}
                                columns={columns1}
                                striped
                                hover
                                condensed
                                noDataIndication={() => <div>No data available</div>}

                            />
                        </div>
                    </div>
                    <div className="col-7">
                        <p>Result all emloyee{data1.name} team  - total {data2.length} employees </p>
                        <div>
                            {/* <FormDetailTable /> */}
                            <BootstrapTable
                                keyField='id2'
                                data={data2}
                                columns={columns2}
                                striped
                                hover
                                condensed
                                noDataIndication={() => <div>No data available</div>}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Team;