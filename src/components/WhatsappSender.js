import { React, useRef, useState, useEffect } from "react";
import { Typography, Grid, Button } from "@mui/material"; // Importing components from @mui/material
import { URI, baseURI } from "./Constants";
import './WhatsappSender.css'
import axios from 'axios'
import { formatDateToDDMMYYYY, calculateDueDate } from "../utils/HelperFunctions"
const WhatsAppSender = ({ tutionData,
  formatedFromDate: fromDate,
  formatedToDate: toDate }) => {
  const classesAttended = tutionData?.classesAttended;
  let tutorId = null;
  let tutorName = null;
  if (
    Array.isArray(classesAttended) &&
    classesAttended.length > 0 &&
    typeof classesAttended[0]?.["Tution ID and Tuttion Name"] === "string"
  ) {
    const [id, name] =
      classesAttended[0]["Tution ID and Tuttion Name"]
        .split(" : ")
        .map(v => v?.trim());

    tutorId = id || null;
    tutorName = name || null;
  }
  const totalFees = tutionData?.finalAmountToParent;
  const totalDurationOfSessionTaken = tutionData?.totalDurationOfSessionTaken;
  const toNewDate = calculateDueDate(toDate);
  let resultToWhatsapp = "";
  resultToWhatsapp += `SMARTPOINT E-PAY\nClass hour updates\n(${formatDateToDDMMYYYY(fromDate)
    .split("-")
    .reverse()
    .join(".")} to ${formatDateToDDMMYYYY(toDate).split("-").reverse().join(".")})\n\n`;
  resultToWhatsapp += `Tuition ID: ${tutorId}\nTutor: ${tutorName}\n\n`;
  classesAttended.forEach((cls) => {
    resultToWhatsapp += `${cls["Session Date"]
      .split("-")
      .reverse()
      .join("-")}- ${cls["Duration of Session taken"]} hrs \n`;
  });
  resultToWhatsapp += `--------------------------\nTotal class hours: ${totalDurationOfSessionTaken} hrs`;
  resultToWhatsapp += `\nTotal Fees: ${totalFees}/-\nAccount No: 39891065373\nIFSC CODE: SBIN0009485`;
  resultToWhatsapp += `\nAmount payable : ${totalFees}/-\nPhonePe: +91 8848083747`;
  resultToWhatsapp += `\nPayment due date: ${toNewDate}\n\nNote: Please confirm the payment by sharing a screenshot`;
  const [buttonState, setButtonState] = useState('');
  const [status, setStatus] = useState("");
  const [lastSentTime, setLastSentTime] = useState(null);
  const isMounted = useRef(false);
  const hasSentMessage = useRef(false);
  let [messageSend, setMessageSend] = useState(false);
  const prevResultToWhatsapp = useRef(resultToWhatsapp); // Track previous value of resultToWhatsapp


  const sendMessage = () => {
    if (lastSentTime !== null) {
      // Check if sending another message exceeds the rate limit
      const elapsed = Date.now() - lastSentTime;
      if (elapsed < 1000) {
        // 1 second rate limit
        setTimeout(sendMessage, 1000 - elapsed);
        return;
      }
    }
    sendRequest();
  };
  const handleSendMessage = async () => {
    setButtonState('loading');
    setStatus('Sending message...');

    try {
      // Call the sendMessage function
      if (sendMessage) {
        await sendMessage();
      }

      // Simulate success
      setButtonState('success');
      setStatus('Message sent successfully!');

      // Reset after 2 seconds
      setTimeout(() => {
        setButtonState('');
        setStatus('Ready to send');
      }, 2000);

    } catch (error) {
      setButtonState('error');
      setStatus('Failed to send message');

      // Reset after 2 seconds
      setTimeout(() => {
        setButtonState('');
        setStatus('Ready to send');
      }, 2000);
    }
  };

  const sendRequest = () => {
    fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: resultToWhatsapp }),
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.success) {
          setStatus(data.message);
          setMessageSend(true);
          setLastSentTime(Date.now()); // Update last sent time
        } else {
          setStatus(`Error sending message "${data.message}`);
        }
      })
      .catch((error) => {
        // alert("Error!!!");
        setStatus(`Error from whtsappSender : ${error.message}`);
      });
  };
  useEffect(() => {
    // Check if the component is mounted and resultToWhatsapp has changed
    if (
      isMounted.current &&
      !hasSentMessage.current

      // prevResultToWhatsapp.current !== resultToWhatsapp
    ) {

      hasSentMessage.current = true; // Mark that the message has been sent
    } else {
      isMounted.current = true;
    }
    // Update the previous value of resultToWhatsapp
    prevResultToWhatsapp.current = resultToWhatsapp;
    return () => {
      // Cleanup function
      setStatus("");
      setLastSentTime(null);
    };
  }, [resultToWhatsapp]);

  useEffect(() => {
    if (!tutionData) {


      
      return;
    }
    if (!messageSend) return;

    
    const {
      totalDurationOfSessionTaken,
      tutorPhoneNumber,
      paymentToTutorPerHr,
      paymentToParentPerHr,
      registrationFee,
      profit,
      toTutorAfterRegistrationFee,
      toTutorBeforeRegistration,
      tutionIdAndTutionName,
      finalAmountToParent
    } = tutionData || {};

    const payload = {
      totalDurationOfSessionTaken,
      tutorPhoneNumber,
      paymentToTutorPerHr: Number(paymentToTutorPerHr),
      paymentToParentPerHr: Number(paymentToParentPerHr),
      registrationFee,
      profit,
      toTutorAfterRegistrationFee,
      toTutorBeforeRegistration,
      tutionIdAndTutionName,
      finalAmountToParent
    };
    
    axios.post(`${baseURI}/api/tution-payments`, payload)
      .then(() => {
        setMessageSend(false);
      })
      .catch(err => console.error(err))
  }, [messageSend, tutionData]);
  return (
    <div className="whatsapp-sender-container">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className="whatsapp-grid-container"
      >
        <Grid item className="whatsapp-status-item">
          <Typography
            variant="body1"
            className="whatsapp-status-text"
          >
            {status}
          </Typography>
        </Grid>
        <Grid item className="whatsapp-button-item">
          <Button
            variant="contained"
            onClick={handleSendMessage}
            className={`whatsapp-send-button ${buttonState}`}
            disabled={buttonState === 'loading'}
          >
            {buttonState === 'loading' ? 'Sending...' :
              buttonState === 'success' ? 'Sent!' :
                buttonState === 'error' ? 'Failed' :
                  '📱 Send WhatsApp'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default WhatsAppSender;
