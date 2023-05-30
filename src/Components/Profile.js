import React from "react";
import { useParams } from "react-router-dom";
import DetailUser from "../Detail/DetailUser";
import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const { id } = useParams();

  return (
    <div className="container  ">


      <DetailUser id={id} /> 
    </div>
  );
};

export default Profile;
