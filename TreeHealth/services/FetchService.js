import { AsyncStorage } from "react-native";
import { Toast } from "native-base";
import * as SecureStore from "expo-secure-store";
import globals from "./../globals";
import _ from "underscore";


/*
*   User Route:
*/

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

// create a new account
const generateUser = async (
  name,
  email,
  password,
  affiliationid = -1,
  roleid
) => {
  const RequestResult = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/create",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        affiliationid,
        // TODO: these probably should be checked automatically
        isadminapprovalneeded: false,
        isapprovedbyadmin: false,
        roleid
      })
    }
  )
    .then(res => res.json())
    .catch(err => {});
  return RequestResult;
};

export const processSignup = (name, email, pass, affiliationid, roleid) => {
  return new Promise(resolve => {
    resolve(generateUser(name, email, pass, affiliationid, roleid));
  });
};

// log the user in and store the information securely
const generateUserToken = async (email, password) => {
  const UserData = await fetch(
    globals.SERVER_URL.toString() + "/userAccount/validate",
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }
  )
    // if 200 then it authed okay, if 500, it's an auth failure
    .then(res => {return res.ok ? res.json() : {} } )
    .then(res => { return res.hasOwnProperty("result") ? res.result[0] : {} } )
    .catch(err => {
      return { status: "offline"};
    });

  if (
    UserData.hasOwnProperty("userid") &&
    UserData.hasOwnProperty("access_token")
  ) {
    await SecureStore.setItemAsync("userToken", UserData.userid.toString());
    await SecureStore.setItemAsync(
      "userAuth",
      UserData.access_token.toString()
    );
  }

  return UserData;
};

export const processLogin = (email, password) => {
  return new Promise(resolve => {
    resolve(generateUserToken(email, password));
  });
};

/*
*   Affiliation Route:
*/

// get a list of all the affiliations
export const getAffilations = async cb => {
  const aff = await fetch(globals.SERVER_URL + "/affiliations/active")
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

/*
*   Role Route:
*/

// get a list of all the roles
export const getRoles = async cb => {
  const roles = await fetch(globals.SERVER_URL + "/roles")
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

/*
*   Location Route:
*/

// for updating an existing record's location value
export const updateLocation = async (
  longitude,
  latitude,
  locationid,
  userid,
  JWT
) => {
  await fetch(globals.SERVER_URL.toString() + "/location/update", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`
    },
    method: "POST",
    body: JSON.stringify({
      longitude,
      latitude,
      locationid,
      userid
    })
  })
    .then(res => {
      return res.ok;
    })
    .catch(err => {
      return false;
    });
};

// try to get the  point data from cache, if not get from the site.
const getPointData = async (
  ID,
  userID,
  forceUpdate = false,
  AuthToken = ""
) => {
  const projectID = ID == -1 || typeof ID == "undefined" ? "" : ID.toString();
  let pointsData = await AsyncStorage.getItem("Points");
  if (pointsData !== null && !forceUpdate) {
    // get all the storied points and filter the ones with the correct ID
    pointsData = JSON.parse(pointsData);
    pointsData.result = pointsData.result.filter(
      points => points.projectid == ID
    );
  } else {
    AllPoints = await fetch(globals.SERVER_URL + "/locationByProject/", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${AuthToken}`
      }
    })
      .then(response => response.json())
      .catch(err => {});
    pointsData = await fetch(
      globals.SERVER_URL + "/locationByProject/" + projectID,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${AuthToken}`
        },
      }
    )
      .then(response => response.json())
      .catch(err => {});
    await AsyncStorage.setItem("Points", JSON.stringify(AllPoints));
  }
  return pointsData;
};

export const processPntData = (ID, userID, forceUpdate = false, AuthToken) => {
  return new Promise(resolve => {
    resolve(getPointData(ID, userID, forceUpdate, AuthToken));
  });
};

// finds the difference of two array of answer/answerID pairs
const diffAnswerObj = (arr, arr2) => {
  return _.filter(arr, (item, index) => {
    return (_.findIndex(arr2, itemObj => { return itemObj.questionid === item.questionid }) === -1)
  });
}

// create a new record location
const generateLocationID = async (
  longitude,
  latitude,
  projectid,
  userid,
  title,
  url,
  description,
  ispublic,
  answers,
  AuthToken = "",
  createddate
) => {
  let formData = new FormData();
  formData.append('longitude', longitude.toString());
  formData.append('latitude', latitude.toString());
  formData.append('projectid', projectid);
  formData.append('createdby', userid);
  formData.append('title', title);
  formData.append('url', url);
  formData.append('description', description);
  formData.append('ispublic', ispublic.toString());
  formData.append('createddate', createddate.toString());

  const imageQuestions = answers.filter(answer => answer.answer.startsWith("file://", 0));
  const otherAnswers = diffAnswerObj(answers, imageQuestions);

  formData.append('questionsAnswered', JSON.stringify(otherAnswers));
  formData.append('imgCount', imageQuestions.length);

  // for each image we need to make a blob and answerid
  imageQuestions.map((questionObj, index) => {
    formData.append('answerID' + index, questionObj.questionid);
    formData.append('answer' + index,  {uri: questionObj.answer, name: 'image.jpg', type: 'image/jpeg'});
  });

  return await fetch(
    globals.SERVER_URL.toString() + "/location/mobile/create",
    {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
        'Content-Type': 'multipart/form-data'
      },
      method: "POST",
      body: formData
    }
  )
    .catch(err => {});
};

export const processLocationID = (
  longitude,
  latitude,
  projectid,
  userid,
  title,
  url,
  description,
  ispublic,
  answers,
  AuthToken,
  createddate
) => {
  return new Promise(resolve => {
    resolve(
      generateLocationID(
        longitude,
        latitude,
        projectid,
        userid,
        title,
        url,
        description,
        ispublic,
        answers,
        AuthToken,
        createddate
      )
    );
  });
};

/*
*   Question Route:
*/

// get the list of questions from storage or from server and store it
const getQuestionsData = async (ID, AuthToken) => {
  const projectID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  let questionsStored = await AsyncStorage.getItem(
    "questions-PID-" + projectID
  );
  let questionsData = [];
  if (questionsStored !== null) {
    questionsData = JSON.parse(questionsStored);
  } else {
    questionsData = await fetch(
      globals.SERVER_URL + "/projectQuestion/questionsByProjectId/" + projectID + "/active",
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${AuthToken}`
        }
      }
    )
      .then(response => response.json())
      .catch(err => {});

    questionsData =
      questionsData !== "undefined"
        ? questionsData.hasOwnProperty("result")
          ? questionsData.result
          : []
        : [];
    // sort the questions based on their display order
    questionsData.sort((a, b) => a.displayorder - b.displayorder);
    await AsyncStorage.setItem(
      "questions-PID-" + projectID + '',
      JSON.stringify(questionsData)
    );
  }

  return questionsData;
};

export const processQuestData = (ID, AuthToken) => {
  return new Promise(resolve => {
    resolve(getQuestionsData(ID, AuthToken));
  });
};

/*
*   Answer Route:
*/

// get the answers from a locationID to edit old data
const getAnswerData = async (ID, AuthToken) => {
  const locationID = ID == -1 || ID == "undefined" ? "" : ID.toString();
  const questionsData = await fetch(
    globals.SERVER_URL + "/answer/byLocationId/" + locationID,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${AuthToken}`
      },
      method: "POST"
    }
  )
    .then(response => response.json())
    .catch(err => {});
  return questionsData;
};

export const processAnswerData = (ID, AuthToken) => {
  return new Promise(resolve => {
    resolve(getAnswerData(ID, AuthToken));
  });
};

// TODO: remove and implent this from ProjectWrapper.js
// update an already existing answer to a specific answerID
export const updateAnswer = async (state, AuthToken) => {
  await fetch(globals.SERVER_URL + "/answer/update", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${AuthToken}`
    },
    method: "POST",
    body: JSON.stringify({
      answerid: state.items[0].answerID,
      answer: state.items[0].answer
    })
  })
    .then(res => {
      if (res.ok) {
        // if the update happens, then we will update the queue
        const oldStateItems = state.items;
        delete oldStateItems[0];
        return { items: [...oldStateItems] };
      }
    })
    .catch(err => {});

  return state;
};

// TODO: remove and implent this from ProjectWrapper.js
// create a new answer in relation to a questionID and locationID
export const createAnswer = async (state, payload) => {
  await fetch(globals.SERVER_URL + "/answer/create", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload.AuthToken}`
    },
    method: "POST",
    body: JSON.stringify({
      questionid: payload.questionid,
      answeredby: payload.userid,
      answer: payload.answer,
      createddate: payload.createddate,
      locationid: payload.locationID
    })
  })
    .then(res => {
      if (res.ok) {
        const oldStateItems = state.items;
        delete oldStateItems[0].answers[payload.questionid];
        return { items: [...oldStateItems] };
      }
    })
    .catch(err => {});
  return state;
};

/*
*   Project Route:
*/

// save project list to local stoage
const setProjectData = async data => {
  return await AsyncStorage.setItem("Projects", JSON.stringify(data));
};

// try to get the Project data from cache, if not get from the site.
const getProjectData = async (forceUpdate = false, UserID, AuthToken = "") => {
  let projectData = await AsyncStorage.getItem("Projects");
  if (projectData !== null && !forceUpdate) {
    projectData = JSON.parse(projectData);
  } else {
    projectData = await fetch(globals.SERVER_URL + "/projects/active", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${AuthToken}`
      },
    })
      .then(response => response.json())
      .catch(err => {});
    // TODO: if offline/fails, we should try return cache and that it failed to get updated data
    // Since AsyncStorage is immunitable, the projects object should be deleted before being set
    if (projectData !== null) {
      await AsyncStorage.removeItem("Projects").then(() => {
        setProjectData(projectData);
      });
    } else {
      setProjectData(projectData);
    }
  }
  return projectData;
};

export const processProjData = (forceUpdate = false, UserID, AuthToken) => {
  return new Promise(resolve => {
    resolve(getProjectData(forceUpdate, UserID, AuthToken));
  });
};
