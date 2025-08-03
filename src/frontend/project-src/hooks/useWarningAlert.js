import { useState, useCallback } from 'react';

const useWarningAlert = () => {
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const [warningConfig, setWarningConfig] = useState({
    title: '',
    message: '',
    buttonText: 'Okay',
  });

  const showWarning = useCallback((title, message, buttonText = 'Okay') => {
    setWarningConfig({ title, message, buttonText });
    setIsWarningVisible(true);
  }, []);

  const hideWarning = useCallback(() => {
    setIsWarningVisible(false);
  }, []);

  return {
    isWarningVisible,
    warningConfig,
    showWarning,
    hideWarning,
  };
};

export default useWarningAlert;
