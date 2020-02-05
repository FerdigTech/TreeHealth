import { Toast } from "native-base";
import globals from "./../globals";

// used to reset a users password
export const handlePassReset = async Email => {
  await fetch(globals.SERVER_URL + "/userAccount/resetPassword", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      email: Email
    })
  })
    .then(res => {
      if (res.ok) {
        Toast.show({
          text: "A password reset has been to the associated email.",
          buttonText: "Okay",
          type: "success",
          position: "top",
          duration: 3000
        });
      }
    })
    .catch(err => {});
};

// get a list of all the affiliations
export const getAffilations = async cb => {
  const aff = await fetch(globals.SERVER_URL + "/affiliations")
    .then(res => res.json())
    .then(res => {
      // if we get a result otherwise return nothing
      if (res.hasOwnProperty("result")) {
        return res.result;
      } else {
        return [];
      }
    })
    .catch(err => {
      return [];
    });
  cb(aff);
};

// get a list of all the roles
export const getRoles = async cb => {
  const roles = await fetch(globals.SERVER_URL + "/userRoles")
    .then(res => res.json())
    .then(res => {
      // if we get a result otherwise return nothing
      if (res.hasOwnProperty("result")) {
        return res.result;
      } else {
        return [];
      }
    })
    .catch(err => {
      return [];
    });
  cb(roles);
};
