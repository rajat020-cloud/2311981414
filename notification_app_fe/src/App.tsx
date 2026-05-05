import React, { useEffect } from 'react';
import { NotificationList } from './components/NotificationList';
import { Log } from '../../logging_middleware/logger';

const App: React.FC = () => {
  useEffect(() => {
    Log("frontend", "info", "page", "Main Application page mounted");
  }, []);

  return (
    <div>
      <NotificationList />
    </div>
  );
};

export default App;
