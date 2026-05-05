import React, { useEffect } from 'react';
import { NotificationList } from './components/NotificationList';
import { Log } from '../../shared/logger';

const App: React.FC = () => {
  useEffect(() => {
    Log("frontend", "info", "page", "Application root initialized");
  }, []);

  return (
    <div>
      <NotificationList />
    </div>
  );
};

export default App;
