import { Avatar, IconButton } from '@mui/material';
import styled from 'styled-components';
import ChatIcon from '@mui/icons-material/Chat';
import CustomMoreVertical from './CustomMoreVertical';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOffIcon from'@mui/icons-material/NotificationsOff';
import  ArrowForwardIosIcon  from '@mui/icons-material/ArrowForwardIos';
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, where, query } from '@firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../Auth';
import { onSnapshot } from 'firebase/firestore';
import Friend from './Friend';
import Chat from './Chat';
import Fuse from 'fuse.js';
const Sidebar = () => {
  const [friends, setFriends] = useState([])
  const [chats, setChats] = useState([])
  const [searchFriends, setSearchFriends] = useState(false)
  const [input, setInput] = useState("")
  const inputAreaRef = useRef(null)
  const { currentUser } = useAuth();
  const fuse = new Fuse(friends, {
    keys: ['email', 'displayName']
  })
  const friends_result = fuse.search(input)
  useEffect(() => {
    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setChats(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
    return unsubscribe
  }, [])

  useEffect(()=> {
    async function fetchFriends() {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "!=", currentUser?.email));
      const querySnapshot = await getDocs(q);
      setFriends(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    fetchFriends()
  }, [])
  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (!inputAreaRef.current.contains(e.target)) {
        setTimeout(() => {
          setSearchFriends(false);
        }, 3000);

      } else {
        setSearchFriends(true);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [])
  return (
    <Container>
        <Header>
          <UserAvatar src={currentUser.photoURL} />
          <IconsGroup>
            <IconButton>
               <ChatIcon />
            </IconButton>
            <CustomMoreVertical />
          </IconsGroup>
        </Header>
        <Notification>
             <NotificationAvatar>
               <NotificationsOffIcon style={{ color: '#9DE1FE'}}/>
             </NotificationAvatar>
             <NotificationText>
               <div>Get Notified of New Messages</div>
             <div style={{display: 'flex' , alignItems: 'center'}}>
             <a href="#"><u>Turn on desktop notifications</u></a>
               <IconButton><ArrowForwardIosIcon style={{width:15,height:15}} /></IconButton>
             </div>
             </NotificationText>
        </Notification>
        <SearchChat>
          <SearchBar>
            <SearchIcon />
            <SearchInput ref={inputAreaRef} placeholder="Search or start a new chat" onChange={e => setInput(e.target.value)} />
          </SearchBar>
        </SearchChat>
        {searchFriends ? <>
        {friends_result.map(({item}) => (
          <Friend key={item.id} photoURL={item.photoURL}
          displayName={item.displayName} id={item.id} />
        ))}

        </> : <>
           {chats.map(chat => <Chat key={chat.id} id={chat.id} users={chat.users} 
           latestMessage={chat.latestMessage} timestamp={chat.timestamp} />)}
        </>}
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
background-color: white;
min-width: 320px;
max-width: 450px;
height: 100%
`
const Header = styled.div`
     display:flex;
     position:sticky;
     top:0;
     background-color:white;
     jsutify-content:space-between;
     align-items:center;
     padding:15px;
     height:80px;
     border-bottom:1px solid whitesmoke;
     width:100%;
`;

const UserAvatar = styled(Avatar)`
    cursor:pointer;
    :hover{
      opacity:0.8;
    }
`;
const IconsGroup = styled.div`
    margin-left: 60%;
    display:flex;
`;
const SearchChat = styled.div`
background-color: #f6f6f6;
border-bottom: 1px solid rgba(0,0,0,0.1);
padding: 20px;
`;
const SearchBar = styled.div`
display: flex;
padding: 5px;
border-radius:10px;
border-bottom: 1px solid #ededed;
background: white;
`;
const SearchInput = styled.input`
     width: 100%;
     border: none;
`;
const Notification = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
padding: 10px;
background-color: #9DE1FE;
`;
const NotificationAvatar = styled(Avatar)`
background-color: white;
`
const NotificationText = styled.div`
display: flex;
flex-direction: column;
`