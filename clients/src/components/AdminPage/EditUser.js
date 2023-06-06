import React, { Fragment, useState } from "react";

const EditUser = (user) => {

  //edit description function

  const UpdateUser = async e => {
    e.preventDefault();
    try {
      const body = { user };
      console.log(body)
      console.log("aa")
      const response = await fetch(
        `http://localhost:8000/api/get-users/${user.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)

        }
      );

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };
  UpdateUser();
}
export default EditUser;