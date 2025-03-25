import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function AppContent({ user }) {
  const [userGroup, setUserGroup] = useState(null);
  
  let content = <p>Loading...</p>;

  useEffect(() => {
    fetchAuthSession()
      .then(session => {
  
        const payload = session.tokens?.accessToken?.payload;
  
        const groups = payload?.["cognito:groups"];
  
        if (groups?.includes("Admin")) 
          setUserGroup("Admin");
        else if (groups?.includes("FrontDesk")) 
          setUserGroup("FrontDesk");
        else 
          setUserGroup("Unknown");
      })
      .catch(err => {
        setUserGroup("Unknown");
      });
  }, []);
  

  if (userGroup === "Admin") {
    content = (
      <div>
        <h3> Admin Dashboard</h3>
        <p>Here you can add/edit/remove tutors and schedules.</p>
      </div>
    );
  } 
  else if (userGroup === "FrontDesk") {
    content = (
      <div>
        <h3> Front Desk Tools</h3>
        <p>Search tutors and check availability here.</p>
      </div>
    );
  } 
  else if (userGroup === "Unknown") {
    content = (
      <div>
        <p>You are not part of a recognized user group.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Logged in as: {userGroup}</h2>
      {content}
    </div>
  );
}

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem' }}>
          <AppContent user={user} />
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
