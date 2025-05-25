import './CommentStructure.scss'
import '@szhsin/react-menu/dist/core.css'

import React, { useContext } from 'react'
import { Menu, MenuItem } from '@szhsin/react-menu'
import { Avatar, Button } from "antd";
import { UserOutlined, MoreOutlined } from '@ant-design/icons';

import DeleteModal from './DeleteModal'
import { GlobalContext } from '../../context/Provider'
import InputField from '../InputField/Index'
import { Comment, CommentStatus } from "../../interface";

interface CommentStructureProps {
  info: Comment
  editMode: boolean
  parentId?: string
  replyMode: boolean
  showTimestamp?: boolean
  logIn: {
    loginLink?: string | (() => void)
    signUpLink?: string | (() => void)
    onLogin?: string | (() => void)
    onSignUp?: string | (() => void)
  }
}

const CommentStructure = ({
  info,
  editMode,
  parentId,
  replyMode,
  showTimestamp
}: CommentStructureProps) => {
  const globalStore: any = useContext(GlobalContext)
  const currentUser = globalStore.currentUserData

  const optionsMenu = () => {
    return (
      <div className='userActions'>
        {info.userId === currentUser.currentUserId && (
          <Menu
            menuButton={
            <Button type="text" shape="circle" icon={<MoreOutlined style={{ fontSize: 18 }}/>} />
            }
          >
            <MenuItem
              onClick={() => globalStore.handleAction(info.comId, true)}
            >
              Edit
            </MenuItem>
            <MenuItem>
              <DeleteModal comId={info.comId} parentId={parentId} />
            </MenuItem>
          </Menu>
        )}
      </div>
    )
  }

  const timeAgo = (date: string | number | Date): string => {
    const units = [
      { label: 'y', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 }
    ];
  
    const time = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
    for (const { label, seconds } of units) {
      const interval = Math.floor(time / seconds);
      if (interval >= 1) {
        return `${interval}${label}`;
      }
    }
  
    return 'now';
  };  

  const userInfo = () => {
    return (
      <div className='commentsTwo'>
        <a className='userLink' target='_blank' href={info.userProfile}>
          <div>
            {/* <img
              src={info.avatarUrl}
              alt='userIcon'
              className='imgdefault'
              style={
                globalStore.imgStyle ||
                (!globalStore.replyTop
                  ? { display: 'flex', justifyContent: 'center', alignItems: 'center' }
                  : null)
              }
            /> */}
            <Avatar size={32} src={info.avatarUrl} icon={<UserOutlined />} />
          </div>
          <div className='fullName'>
            {info.fullName}
            {/* <span className='commenttimestamp'>
              {showTimestamp &&
                (info.timestamp == null ? null : timeAgo(info.timestamp))}
            </span> */}
          </div>
        </a>
      </div>
    )
  }

  const replyTopSection = () => {
    return (
      <div className='halfDiv'>
        <div className='userInfo'>
          <div>{info.text}</div>
          replyTopSection{userInfo()}
        </div>
        {currentUser && optionsMenu()}
      </div>
    )
  }

  const replyBottomSection = () => {
    return (
      <div className='halfDiv'>
        <div className='userInfo' >
         {userInfo()}
          {globalStore.advancedInput ? (
            <div style={{display:"flex"}}>
              <div
                className='infoStyle'
                style={{backgroundColor: "#f3f3f3", padding: '10px', borderRadius: "15px"}}
                dangerouslySetInnerHTML={{
                  __html: info.text
                }}
              />
              {currentUser && optionsMenu()}
            </div>
          ) : (
            <div style={{display:"flex"}}>
              <div className='infoStyle'>{info.text}</div>
              {currentUser && optionsMenu()}
            </div>
          )}
          <div style={{ marginLeft: 36 }}>
            {' '}
            {currentUser && (
              <div>
                {
                  info.status == CommentStatus.Posting 
                  ? <span>Posting...</span>
                  : <div>
                      <span className='commenttimestamp'>
                        {showTimestamp && (info.timestamp == null ? null : timeAgo(info.timestamp))}
                      </span>
                      <Button 
                        className="replyBtn"
                        color="default" 
                        variant="link" 
                        size="small"
                        onClick={()=>  globalStore.handleAction(info.comId, false) } >Reply</Button>    
                    </div>
                }
              </div>
            )}
          </div>
        </div>
        
      </div>
    )
  }

  const actionModeSection = (mode: string) => {
    if (mode === 'reply') {
      return (
        <div className='replysection'>
          {globalStore.replyTop ? replyTopSection() : replyBottomSection()}
          <InputField
            formStyle={{
              backgroundColor: 'transparent',
              padding: '20px 0px',
              marginLeft: '-15px'
            }}
            comId={info.comId}
            fillerText={''}
            mode={'replyMode'}
            parentId={parentId}
          />
        </div>
      )
    } else {
      return (
        <InputField
          formStyle={{
            backgroundColor: 'transparent',
            padding: '20px 0px',
            marginLeft: '-15px'
          }}
          comId={info.comId}
          fillerText={info.text}
          mode={'editMode'}
          parentId={parentId}
        />
      )
    }
  }

  const renderActionSection = () => {
    if (editMode) return actionModeSection('edit');
    if (replyMode) return actionModeSection('reply');
    if (globalStore.replyTop) return replyTopSection();
    return replyBottomSection();
  };

  return ( <div> { renderActionSection() } </div> )
}

export default CommentStructure
