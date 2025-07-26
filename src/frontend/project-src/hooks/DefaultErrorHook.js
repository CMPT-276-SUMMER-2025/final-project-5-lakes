import { useState, useCallback } from 'react';

const useDefaultError = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    type: 'error', 
    title: '',
    message: '',
    buttonText: 'Okay',
  });

// function displays the error message
// allows you to specify the message displayed
  const showAlert = useCallback((type, title, message, buttonText = 'Okay') => {
    setAlertConfig({ type, title, message, buttonText });
    setIsAlertVisible(true); 
  }, []); 

  const hideAlert = useCallback(() => {
    setIsAlertVisible(false);
  }, []); 

  return {
    isAlertVisible,
    alertConfig,
    showAlert, 
    hideAlert,
  };
};

export default useDefaultError;
