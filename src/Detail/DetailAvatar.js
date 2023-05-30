import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBBadge } from 'mdb-react-ui-kit';
import authHeader from '../services/auth-header';
import '../Styles/img-wrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import AuthService from "../services/auth.service";


function DetailAvatar(props) {

    const { id } = useParams();
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        if (props.UrlPhoto !== "") {
            setAvatarUrl(props.UrlPhoto);
        }
        console.log('>>>>>LINK CHANGED', props.UrlPhoto)
        setImgUrl(props.UrlPhoto)
    }, [props.UrlPhoto]);

    const currentUser = AuthService.getCurrentUser();

    const defaultAvatarUrl = props.Gender === `Male` ? "/MaleAvatar.png" : "/FemaleAvatar.png";

    const [imgUrl, setImgUrl] = useState(avatarUrl ? avatarUrl : defaultAvatarUrl);

    const handleChangeFile = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        axios.put(`http://localhost:8080/users/${id}`, formData, { headers: authHeader() })
            .then(() => {
                console.log(formData);
                setImgUrl(URL.createObjectURL(file));
            })
            .catch(() => {
                console.log("Failed to");
            });
    };
    return (<div >

        <label htmlFor="photo-upload" className="custom-file-upload fas">
            <div className="img-wrap img-upload" >
                <img htmlFor="photo-upload"
                    alt='avatar'
                    src={imgUrl ? imgUrl : defaultAvatarUrl} />
            </div>
            <input id="photo-upload" type="file" onChange={handleChangeFile} />
        </label>

        <div className="container">
            <div className="row d-flex justify-content-center">
                <MDBBadge color='success col-3 mr-3' pill>
                    No: {props.No}
                </MDBBadge>
                <MDBBadge color='primary col-3 mr-3' pill>
                    Age: {props.Age}
                </MDBBadge>
                <MDBBadge color='warning col-4 ' pill>
                    Sex: {props.Gender}
                </MDBBadge>
            </div>
            <div className='row mt-3 d-flex justify-content-center'>
                <MDBBadge color='warning ' pill>
                    Phone number: {props.PhoneNumber}
                </MDBBadge>
            </div>
        </div>
        <div className="row  d-flex justify-content-center">
            <MDBBadge color='danger mt-4' pill>
                <ul className=" list-unstyled d-flex justify-content-center m-0">
                     <li className="align-self-center p-1">{props.Role}</li>
                </ul>
            </MDBBadge>
        </div>
    </div>);
}

export default DetailAvatar;