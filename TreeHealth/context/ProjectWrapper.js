import React, { useEffect, useState, useReducer, useLayoutEffect } from "react";
import ProjectContext from "./ProjectProvider";
import { AsyncStorage } from "react-native";
import globals from "../globals";
import { useNetInfo } from "@react-native-community/netinfo";
import NavigationService from "../services/NavigationService";
import { Toast, Root } from "native-base";
import * as SecureStore from "expo-secure-store";
import { decode } from "base-64";
import {
  processProjData,
  processPntData,
  processSignup,
  processLogin,
  processLocationID,
  processLocationUpdate
} from "./../services/FetchService";

// import * as FileSystem from 'expo-file-system';
// // ExcelJS
// import ExcelJS from 'exceljs';
// // Share excel via share dialog
// import * as Sharing from 'expo-sharing';
// // From @types/node/buffer
//import { Buffer as NodeBuffer } from 'buffer';


const ProjectProvider = ProjectContext.Provider;

// used to see if data is being loaded into stoage (critical area)
let MutexLocked = false;

// use hook to get the project data
const useProjects = (UserID, AuthToken) => {
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    processProjData(false, UserID, AuthToken).then(results => {
     // console.log("results project------------------------------------------",results);
      setProjects(results);
    });
  }, []);
  return { Projects, setProjects };
};

// use hook to get the data
const usePoints = (userID, AuthToken) => {
  const [Points, setPoints] = useState([]);
  useEffect(() => {
    processPntData(-1, userID, false, AuthToken).then(results => {
   // console.log("results hook------------------------------------------",results.data);
      setPoints(results);
    });
  }, []);
  return { Points, setPoints };
};

const OfflineReducer = (state, action) => {
  switch (action.type) {
    case "add":
      Toast.hide();
      Toast.show({
        text: "Your record has been added to the queue.",
        buttonText: "Okay",
        type: "warning",
        position: "top",
        duration: 3000
      });
      waitAndUpdateStorage({ items: [...state.items, action.payload] });
      return { items: [...state.items, action.payload] };
    case "pop":
      Toast.hide();
      Toast.show({
        text: "Your record(s) has been uploaded to the server.",
        buttonText: "Okay",
        type: "success",
        position: "top",
        duration: 3000
      });
      // one item left, so we are finished
      console.log("popping");
      waitAndUpdateStorage({
        items: state.items.filter((_, i) => i !== 0)
      });
      return { items: state.items.filter((_, i) => i !== 0) };

    case "set":
      waitAndUpdateStorage(action.payload);
      return action.payload;

    default:
      throw new Error();
  }
};

const getUserInfo = async () => {
  const asyncUserID = await SecureStore.getItemAsync("userToken");
  const asyncToken = await SecureStore.getItemAsync("userAuth");
  return { asyncUserID, asyncToken };
};
const processUserAuth = () => {
  return new Promise(resolve => {
    resolve(getUserInfo());
  });
};

// it should be noted the the max size for AsyncStorage is 5MB
// and it could be cleared in IOS8
// perhaps a local-database solution might be the fix for this?
const updateStorage = async value => {
  // in critical area and updating memory
  MutexLocked = true;
  const oldStorage = await AsyncStorage.getItem("offlineQueue");
  if (oldStorage != null) {
    await AsyncStorage.removeItem("offlineQueue");
  }
  await AsyncStorage.setItem("offlineQueue", JSON.stringify(value));
  // memory storage updated and is out of critical area
  MutexLocked = false;
};
const waitAndUpdateStorage = value => {
  return new Promise(resolve => {
    resolve(updateStorage(value));
  });
};

const getQueueFromStorage = async () => {
  const asyncUserID = await AsyncStorage.getItem("offlineQueue");
  return JSON.parse(asyncUserID);
};
const loadStoredQueue = () => {
  return new Promise(resolve => {
    resolve(getQueueFromStorage());
  });
};


// Build the provider
export const ProjectWrapper = ({ children }) => {
  const ProjectsObj = useProjects(UserID, AuthToken);
  const Projects = ProjectsObj.Projects;
  const setProjects = ProjectsObj.setProjects;

  const [ProjectID, setProjectID] = useState(-1);
  const [ProjectName, setProjectName] = useState("");

  const PointsObj = usePoints(UserID, AuthToken);
  ///let PointsObjResult = processPntData.map(({ Object }) => Object)
  //console.log("data---------------------------------------------------------", PointsObjResult);

  //console.log("projects ==============================================", Projects);

  // console.log("points objtec in wrapper class#####################-------------", PointsObj);

  const Points = PointsObj.Points;
  
  // console.log("fields-----", fields);
  // var dt="";
  // var csv =Points.map(object=> {
  //   //console.log("data------------------------",object);
  //   // var csvContent = "data:text/csv;charset=utf-8,";
  //   // csvContent += object;
  //   // console.log("csvContent-----", csvContent);
  //   dt+=object.affiliationid;
  //   dt+=",";
  //   dt+=object.approvalstatus;
  //   dt+=",";
  //   dt+=object.county;
  //   dt+="\n";

    
  //   return dt;
    
  // })


// //This returns a local uri that can be shared
// const generateShareableExcel = async (): Promise<string> => {
//   const now = new Date();
//   const fileName = 'YourFilename.xlsx';
//   const fileUri = FileSystem.cacheDirectory + fileName;
//   return new Promise<string>((resolve, reject) => {
//     const workbook = new ExcelJS.Workbook();
//     workbook.creator = 'Me';
//     workbook.created = now;
//     workbook.modified = now;
//     // Add a sheet to work on
//     const worksheet = workbook.addWorksheet('My Sheet', {});
//     // Just some columns as used on ExcelJS Readme
//     worksheet.columns = [
//       { header: 'Id', key: 'id', width: 10 },
//       { header: 'Name', key: 'name', width: 32 },
//       { header: 'D.O.B.', key: 'dob', width: 10, }
//     ];
//     // Add some test data
//     Points.map(object=> {
    
//       worksheet.addRow({ id: object.affiliationid, name:object.approvalstatus, dob:object.county });
  
//     }) 

//     // Test styling
//     // Style first row
//     worksheet.getRow(1).font = {
//       name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true
//     };
//     // Style second column
//     worksheet.eachRow((row, rowNumber) => {
//       row.getCell(2).font = {
//         name: 'Arial Black',
//         color: { argb: 'FF00FF00' },
//         family: 2,
//         size: 14,
//         bold: true
//       };
//     });

//     // Write to file
//     workbook.xlsx.writeBuffer().then((buffer: ExcelJS.Buffer) => {
//       // Do this to use base64 encoding
//       const nodeBuffer = NodeBuffer.from(buffer);
//       const bufferStr = nodeBuffer.toString('base64');
//       FileSystem.writeAsStringAsync(fileUri, bufferStr, {
//         encoding: FileSystem.EncodingType.Base64
//       }).then(() => {
//         resolve(fileUri);
//       });
//     });
//   });
// }

// const shareExcel = async () => {
//   console.log("calledddd---------------------");
//   const shareableExcelUri: string = await generateShareableExcel();
//   Sharing.shareAsync(shareableExcelUri, {
//     mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Android
//     dialogTitle: 'Your dialog title here', // Android and Web
//     UTI: 'com.microsoft.excel.xlsx' // iOS
//   }).catch(error => {
//     console.error('Error', error);
//   }).then(() => {
//     console.log('Return from sharing dialog');
//   });
// }

  const setPoints = PointsObj.setPoints;
  const [Update, TriggerUpdate] = useState(false);
  const [OfflineStateQ, dispatcher] = useReducer(
    OfflineReducer,
    { items: [] },
    () => {
      return { items: [] };
    }
  );

  // this can cause issues if items are being saved when finished the queue
  const offlineQueueLoad = loadStoredQueue().then(res => {
    // if more things are in the backstorage than current queue than we need to update
    if (
      res != null &&
      OfflineStateQ.items.length < res.items.length &&
      MutexLocked == false
    ) {
      console.log("we are loading new info to queue");
      dispatcher({
        type: "set",
        payload: res
      });
    }
  });

  const [UserID, setUserID] = useState(null);

  const userInfo = processUserAuth().then(res => {
    if (res.asyncUserID != UserID && res.asyncToken != AuthToken) {
      setUserID(res.asyncUserID != null ? res.asyncUserID : null);
      setAuthToken(res.asyncToken != null ? res.asyncToken : null);
    }
  });

  const [AuthToken, setAuthToken] = useState(null);

  const HandleSignup = (name, email, pass, affiliationid, roleid) => {
    processSignup(name, email, pass, affiliationid, roleid).then(results => {
      if (results.hasOwnProperty("result")) {
        if (results.result) {
          Toast.hide();
          Toast.show({
            text: "Account pending. Check email for verification.",
            buttonText: "Okay",
            type: "success",
            position: "top",
            duration: 3000
          });
          // TODO: Log the user in here?
        }
      } else {
        Toast.hide();
        Toast.show({
          text:
            "Something went wrong with the account creation process, try again.",
          buttonText: "Okay",
          type: "danger",
          position: "top",
          duration: 3000
        });
      }
    });
  };

  const HandleLogin = (email, pass, cb) => {
    processLogin(email, pass).then(results => {
      if (results.hasOwnProperty("userid")) {
        setUserID(results.userid);
        setAuthToken(results.access_token);
        // when we login update project visibility
        processProjData(true, results.userid, results.access_token).then(results => {
          setProjects(results);
        });
        // when we login update records visibility
        processPntData(-1, results.userid, true, results.access_token).then(results => {
          setPoints(results);
        });
        cb(false);
        NavigationService.navigate("Loading");
      } else {
        Toast.hide();
        cb(false);
        if (results.hasOwnProperty("status")) {
          Toast.show({
            text: "You can only login while online.",
            buttonText: "Okay",
            type: "danger",
            position: "top",
            duration: 3000
          });
        } else if (results.hasOwnProperty("error")) {
          Toast.show({
            text: "Please verify your email before attempting to login.",
            buttonText: "Okay",
            type: "warning",
            position: "top",
            duration: 3000
          });
        } else {
          Toast.show({
            text: "Wrong username or password!",
            buttonText: "Okay",
            type: "danger",
            position: "top",
            duration: 3000
          });
        }
      }
    });
  };

  const HandleLogout = async () => {
    setUserID(null);
    setAuthToken(null);
    // when we logout update project visibility
    processProjData(true, UserID, AuthToken).then(results => {
      setProjects(results);
    });
    // when we logout update records visibility
    processPntData(-1, UserID, true, AuthToken).then(results => {
      setPoints(results);
    });
    //await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userAuth");
  };

  const netInfo = useNetInfo();

  // TODO: Write a task to check this at intervals
  useLayoutEffect(() => {
    // if the user is logged in
    if (AuthToken != null && AuthToken != "trial") {
      // get the expiration date
      const { exp } = JSON.parse(decode(AuthToken.split(".")[1]));

      // if the JWT has expired
      if (Math.floor(Date.now() / 1000) > exp) {
        Toast.hide();
        Toast.show({
          text:
            "Your session has expired and you have been logged out as a result.",
          buttonText: "Okay",
          type: "warning",
          position: "top",
          duration: 3000
        });
        HandleLogout();
        NavigationService.navigate("Loading");
      }
    }
  });
  useEffect(
    () => {
      // if online we should try to push all the data in offline queue
      if (netInfo.isConnected) {
        // the reducer seems to initalize to undefined, this is to prevent it from going on
        if (typeof OfflineStateQ.items !== "undefined") {
          // something is in the queue
          if (OfflineStateQ.items.length > 0) {
            // get the coordinates and convert it to a coordinateID
            const { longitude, latitude } = OfflineStateQ.items[0].location.coords;
            // if the location ID hasn't been set
              if (OfflineStateQ.items[0].hasOwnProperty("locationID")) {
                let StateCopy = Object.assign({}, OfflineStateQ);

                processing = processLocationUpdate(
                  (answers = StateCopy.items[0].answers),
                  longitude,
                  latitude,
                  (ispublic = StateCopy.items[0].ispublic),
                  (projectid = StateCopy.items[0].projectid),
                  (locationid = StateCopy.items[0].locationID),
                  (userid = UserID),
                  AuthToken
                ).then(() => {
                  dispatcher({
                    type: "pop"
                  });
                  // after we add data, we need to update our data source
                  processPntData(ProjectID, UserID, true, AuthToken).then(results => {
                    setPoints(results);
                  });
                });
              } else {

              // push to the server
              processLocationID(
                longitude,
                latitude,
                projectid=OfflineStateQ.items[0].projectid,
                (userid = UserID),
                title="",
                url="",
                description="",
                ispublic=OfflineStateQ.items[0].ispublic,
                answers=OfflineStateQ.items[0].answers,
                AuthToken,
                createddate=OfflineStateQ.items[0].createddate,
              ).then(res => {
                if (res.ok) {
                  dispatcher({type: "pop"});
                  // after we add data, we need to update our data source
                  processPntData(ProjectID, UserID, true, AuthToken).then(results => {
                    setPoints(results);
                  });
              } else
                  throw("failed to post data - non 200 error");
              }).catch(err => {
                // seems like the upload failed.
                console.log("[Error]:", err);
              });

            }
          }
        }
      }
    },
    // if change in item queue or net connectivity try to do something
    [OfflineStateQ.items, netInfo.isConnected, Update]
  );

  return (
    <ProjectProvider
      value={{
        Projects:
          typeof Projects !== "undefined"
            ? Projects.hasOwnProperty("result")
              ? Projects.result
              : []
            : [],
        Points,
        setProjectID: ID => {
          processPntData(ID, UserID, false, AuthToken).then(results => {
            setPoints(results);
            setProjectID(ID);
            setProjectName(
              typeof Projects !== "undefined"
                ? Projects.hasOwnProperty("result")
                  ? Projects.result.filter(
                      project => project.projectid == ID
                    )[0].name
                  : Projects.filter(project => project.projectid == ID)[0].name
                : ""
            );
          });
        },
        ProjectID,
        ProjectName,
        updateProjects: () => {
          processProjData(true, UserID, AuthToken).then(results => {
            setProjects(results);
          });
        },
        OfflineQueue: OfflineStateQ.items,
        addToOfflineQueue: locationItem => {
          dispatcher({ type: "add", payload: locationItem });
        },
        processSignup: (name, email, pass, affiliationid, roleid) =>
          HandleSignup(name, email, pass, affiliationid, roleid),
        processLogin: (email, pass, cb) => HandleLogin(email, pass, cb),
        processLogout: () => HandleLogout(),
        UserID,
        AuthToken
      }}
    >
      <Root>{children}</Root>
      
    </ProjectProvider>
    
  );
};
