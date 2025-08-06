// Custom hook for displaying error alerts in a consistent format.
import { useState, useCallback } from 'react';

const useDefaultError = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [onDismiss, setOnDismiss] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    type: 'error', 
    title: '',
    message: '',
    buttonText: 'Okay',
  });

// function displays the error message
// allows you to specify the message displayed
  const showAlert = useCallback((type, title, message, buttonText = 'Okay', onDismissCallback = null) => {
    setAlertConfig({ type, title, message, buttonText });
    setOnDismiss(() => onDismissCallback);
    setIsAlertVisible(true); 
  }, []); 

  const hideAlert = useCallback(() => {
    setIsAlertVisible(false);
    if (onDismiss) {
    onDismiss(); 
    setOnDismiss(null);
    }
  }, [onDismiss]); 

  return {
    isAlertVisible,
    alertConfig,
    showAlert, 
    hideAlert,
  };
};

export default useDefaultError;
