import { Log } from '../../../shared/logger';

const mockNotifications = [
  { 
    id: '1', 
    type: 'Event', 
    title: 'Annual Tech Symposium', 
    message: 'Join us for a 3-day tech talk series starting this weekend in the main auditorium.', 
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false 
  },
  { 
    id: '2', 
    type: 'Placement', 
    title: 'Software Engineer Intern - Google', 
    message: 'Google is coming for campus placements next week. Make sure your resumes are updated.', 
    timestamp: new Date().toISOString(), 
    isRead: false 
  },
  { 
    id: '3', 
    type: 'Result', 
    title: 'Semester 6 Results Declared', 
    message: 'The mid-term results for Semester 6 have been published on the student portal.', 
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true 
  },
];

export const getNotificationsFromDB = async () => {
  await Log("backend", "debug", "db", "Executing database query to fetch all notifications");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, 200);
  });
};
