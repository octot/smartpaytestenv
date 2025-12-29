export function transformData(secondFilteredData) {
  try {

    const outputOfTransformData = secondFilteredData.slice(1).map((item) => ({
      tutorID: item[3],
      submitTime: item[1],
      paymentToParentPerHr: item[11],
      paymentToTutorPerHr: item[12],
      parentPhoneNumber: item[8],
    }));
    console.log("outputOfTransformData:", outputOfTransformData);
    return outputOfTransformData;
  } catch (error) {
    console.error("Error in transformData:", error);
    throw error;
  }
}

export function filterRecords(filteredBasedOnIsRequired, transformedData) {
  try {
    const filteredTutorJsonData = {};
    const filteredTransformedData = [];
    if (filteredBasedOnIsRequired) {
      Object.keys(filteredBasedOnIsRequired).forEach((tutorID) => {
        transformedData.forEach((record) => {
          let numberPart = tutorID.split(":")[0].trim();
          if (record.tutorID === numberPart) {
            filteredTutorJsonData[tutorID] = filteredBasedOnIsRequired[tutorID];
          }
        });
      });
      for (const tutorID in filteredTutorJsonData) {
        if (
          Object.prototype.hasOwnProperty.call(filteredTutorJsonData, tutorID)
        ) {
          transformedData.forEach((record) => {
            let numberPartFilteredTutorJsonData = tutorID.split(":")[0].trim();
            let recordTutorIDString =
              typeof record.tutorID === "string"
                ? record.tutorID
                : String(record.tutorID);
            if (recordTutorIDString === numberPartFilteredTutorJsonData) {
              filteredTransformedData.push(record);
            }
          });
        }
      }
    }
    return { filteredTutorJsonData, filteredTransformedData };
  } catch (error) {
    console.error("Error in filterRecords:", error);
    throw error;
  }
}
export function sortAndRemoveDuplicates(
  filteredTransformedData,
  filteredTutorJsonData
) {
  try {
    const sortedData = filteredTransformedData.sort(
      (a, b) => new Date(b.submitTime) - new Date(a.submitTime)
    );
    const uniqueData = sortedData.filter(
      (record, index, self) =>
        index === self.findIndex((r) => r.tutorID === record.tutorID)
    );
    const tutorTotalDuration = [];
    for (const key in filteredTutorJsonData) {
      if (Object.prototype.hasOwnProperty.call(filteredTutorJsonData, key)) {
        const tutorSessions = filteredTutorJsonData[key];
        let totalDuration = 0;
        tutorSessions.forEach((session) => {
          totalDuration +=
            parseFloat(session["Duration of Session taken"]) || 0;
        });
        tutorTotalDuration.push({
          [key]: [
            {
              classesAttended: filteredTutorJsonData[key],
              totalDurationOfSessionTaken: totalDuration,
            },
          ],
        });
      }
    }
    const combinedRecords = combineData(uniqueData, tutorTotalDuration);
    console.log("combined Records" + combinedRecords)
    return combinedRecords;
  } catch (error) {
    console.error("Error in sortAndRemoveDuplicates:", error);
    throw error;
  }
}

/**Regarding enchancement for adding fields */
export function combineData(uniqueData, tutorTotalDuration) {
  try {
    const combinedData = [];
    uniqueData.forEach((record) => {
      const tutorID = record.tutorID;
      console.log("tutorID ", tutorID)
      console.table("tutorTotalDuration", tutorTotalDuration);

      const tutorDurationObject = tutorTotalDuration.find(obj => {
        const key = Object.keys(obj)[0].trim();   // removes leading/trailing spaces
        const keyId = key.split(":")[0].trim();   // extracts "720" safely
        return keyId === String(tutorID);
      });

      console.table("tutorDurationObject", tutorDurationObject);
      let registrationFee = 0;
      /***Edit*** */
      for (const [tutorID, tutorData] of Object.entries(tutorDurationObject)) {
        const classesAttended = tutorData?.[0]?.classesAttended ?? [];
        const totalDuration = tutorData?.[0]?.totalDurationOfSessionTaken ?? 0;
        const paymentToTutorPerHr = record.paymentToTutorPerHr;
        const paymentToParentPerHr = record.paymentToParentPerHr;
        const toTutorBeforeRegistration = totalDuration * paymentToTutorPerHr;
        const toTutorAfterRegistrationFee =
          toTutorBeforeRegistration - registrationFee;

        const finalAmountToParent =
          totalDuration * paymentToParentPerHr;

        const profit =
          finalAmountToParent - toTutorAfterRegistrationFee;

        const tutionIdAndTutionName =classesAttended?.[0]?.["Tution ID and Tuttion Name"];
        combinedData.push({
          [tutorID]: {
            classesAttended,
            totalDurationOfSessionTaken: totalDuration,
            finalAmountToParent,
            parentPhoneNumber: record.parentPhoneNumber,
            paymentToTutorPerHr,
            paymentToParentPerHr,
            toTutorBeforeRegistration,
            registrationFee,
            toTutorAfterRegistrationFee,
            profit,
            tutionIdAndTutionName
          }
        });
      }
    });
    console.log("combinedDatacombineData:", combineData);
    return combinedData;
  } catch (error) {
    console.error("Error in combineData:", error);
    throw error;
  }
}
function sortByDateSessionRecords(sessions) {
  let newSessions = sessions.sort((a, b) => {
    const dateA = new Date(a["Session Date"]);
    const dateB = new Date(b["Session Date"]);
    return dateA - dateB;
  });
  return newSessions;
}
export function populateTutorJsonData(payRollFilteredData) {
  try {
    const tutorJsonDataRecord = {};
    for (let i = 1; i < payRollFilteredData.length; i++) {
      const entry = payRollFilteredData[i];
      const key = entry[2];
      if (!tutorJsonDataRecord[key]) {
        tutorJsonDataRecord[key] = {
          checked: true,
          sessions: [],
        };
      }
      const obj = {
        "SL NO": entry[0],
        "Submit Date": entry[1],
        "Tution ID and Tuttion Name": entry[2],
        "Session Date": entry[3],
        "Session Start Time": entry[4],
        "Session End Time": entry[5],
        "Duration of Session taken": entry[6],
        "How do you rate your class Experience": entry[7],
        Remarks: entry[8],
        status: entry["status"],
        isRequired: true,
      };
      tutorJsonDataRecord[key].sessions.push(obj);
    }

    for (let [, value] of Object.entries(tutorJsonDataRecord)) {
      if (value.sessions) {
        value.sessions = sortByDateSessionRecords(value.sessions);
      }
    }
    // 
    return tutorJsonDataRecord;
  } catch (error) {
    console.error("Error in populateTutorJsonData:", error);
    throw error;
  }
}
export function populateFilteredBasedOnIsRequired(copyTutorJsonData) {

  const filteredData = {};
  try {
    // Filter the data where `isRequired` is true
    for (const key in copyTutorJsonData) {
      if (copyTutorJsonData.hasOwnProperty(key)) {
        const filteredItems = [];

        if (copyTutorJsonData[key].checked) {
          for (const item of copyTutorJsonData[key].sessions) {
            if (item.isRequired === true) {
              filteredItems.push(item);
            }
          }
          if (filteredItems.length > 0) {
            filteredData[key] = filteredItems;
          }
        }
      }
    }
    return filteredData;
  } catch (error) {
    return {}; // Return an empty object in case of error
  }
}
