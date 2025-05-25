import React, { createContext, useEffect, useState } from 'react'
import _ from 'lodash'

import { Status, CommentStatus, Comment } from "../interface"

export const GlobalContext = createContext({})
export const GlobalProvider = ({
  children,
  currentUser,
  replyTop,
  customImg,
  inputStyle,
  formStyle,
  submitBtnStyle,
  cancelBtnStyle,
  imgStyle,
  commentsCount,
  commentData,
  onSubmitAction,
  onDeleteAction,
  onReplyAction,
  onEditAction,
  currentData,
  currentDataItem,
  replyInputStyle,
  removeEmoji,
  advancedInput,
  placeHolder
}: {
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserProfile?: string | undefined
    currentUserFullName: string
  } | null
  replyTop?: boolean
  customImg?: string
  inputStyle?: object
  formStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  imgStyle?: object
  replyInputStyle?: object
  commentsCount?: number
  removeEmoji?: boolean
  commentData?: Comment[]
  onSubmitAction?: Function
  onDeleteAction?: Function
  onReplyAction?: Function
  onEditAction?: Function
  currentData?: Function
  currentDataItem?: Function
  advancedInput?: boolean
  placeHolder?: string
}) => {
  const [currentUserData] = useState(currentUser);
  const [data, setData] =useState<Comment[]>([]);
  const [editArr, setEdit] = useState<string[]>([]);
  const [replyArr, setReply] = useState<string[]>([]);

  const [pendingAction, setPendingAction] = useState<any | null>(null);

  useEffect(() => {
    if (commentData) {
      setData(commentData)
    }
  }, [commentData])

  useEffect(() => {
    if (currentData) {
      currentData(data)
    }
    
  }, [data])

  useEffect(() => {
    if (pendingAction) {
      onCurrentDataItem(pendingAction);
      setPendingAction(null);
    }
  }, [data]);

  const onCurrentDataItem = (data: any) =>{
    currentDataItem && currentDataItem(data)
  }

  const handleAction = (id: string, edit: boolean) => {
    if (edit) {
      let editArrCopy: string[] = [...editArr]
      let indexOfId = _.indexOf(editArrCopy, id)
      if (_.includes(editArr, id)) {
        editArrCopy.splice(indexOfId, 1)
        setEdit(editArrCopy)
      } else {
        editArrCopy.push(id)
        setEdit(editArrCopy)
      }
    } else {
      let replyArrCopy: string[] = [...replyArr]
      let indexOfId = _.indexOf(replyArrCopy, id)
      if (_.includes(replyArr, id)) {
        replyArrCopy.splice(indexOfId, 1)
        setReply(replyArrCopy)
      } else {
        replyArrCopy.push(id)
        setReply(replyArrCopy)
      }
    }
  }

  const onSubmit = (text: string, uuid: string) => {
    let _data = {
                  userId: currentUserData!.currentUserId,
                  parentId: "",
                  comId: uuid,
                  avatarUrl: currentUserData!.currentUserImg,
                  userProfile: currentUserData!.currentUserProfile
                    ? currentUserData!.currentUserProfile
                    : undefined,
                  fullName: currentUserData!.currentUserFullName,
                  text: text,
                  timestamp: `${new Date().toISOString()}`,
                  status: CommentStatus.Idle,
                  replies: []
                }

    let copyData = [...data]
    copyData.push(_data);
    setData(copyData)
    setPendingAction({mode: Status.New, valus: _data})
  }

  const onEdit = (text: string, comId: string, parentId: string) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      const indexOfId = _.findIndex(copyData[indexOfParent].replies, {
        comId: comId
      })
      copyData[indexOfParent].replies![indexOfId].text = text

      setData(copyData)
      setPendingAction({mode: Status.Edit, comId: copyData[indexOfParent].replies![indexOfId].comId, text})
      handleAction(comId, true)
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      copyData[indexOfId].text = text
      
      setData(copyData)
      setPendingAction({mode: Status.Edit, comId: copyData[indexOfId].comId, text})
      handleAction(comId, true)
    }
  }

  const onReply = (
    text: string,
    comId: string,
    parentId: string,
    uuid: string
  ) => {
    let copyData = [...data]

    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      let _data = {
                    userId: currentUserData!.currentUserId,
                    parentId,
                    comId: uuid,
                    avatarUrl: currentUserData!.currentUserImg,
                    userProfile: currentUserData!.currentUserProfile
                      ? currentUserData!.currentUserProfile
                      : undefined,
                    fullName: currentUserData!.currentUserFullName,
                    text: text,
                    status: CommentStatus.Idle,
                    timestamp: `${new Date().toISOString()}`
                  }
      copyData[indexOfParent].replies!.push(_data)
      
      setData(copyData)
      setPendingAction({mode: Status.New, data: _data})
      handleAction(comId, false)
    } else {
      const indexOfId = _.findIndex(copyData, {
        comId: comId
      })

      let _data = {
                    userId: currentUserData!.currentUserId,
                    parentId: comId,
                    comId: uuid,
                    avatarUrl: currentUserData!.currentUserImg,
                    userProfile: currentUserData!.currentUserProfile
                      ? currentUserData!.currentUserProfile
                      : undefined,
                    fullName: currentUserData!.currentUserFullName,
                    text: text,
                    status: CommentStatus.Idle,
                    timestamp: `${new Date().toISOString()}`
                  }
      copyData[indexOfId].replies!.push(_data)
     
      setData(copyData)
      setPendingAction({mode: Status.New, data: _data})
      handleAction(comId, false)
    }
  }

  const onDelete = (comId: string, parentId: string) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      const indexOfId = _.findIndex(copyData[indexOfParent].replies, {
        comId: comId
      })
      copyData[indexOfParent].replies!.splice(indexOfId, 1)
      
      setData(copyData)
      setPendingAction({mode: Status.Delete, comId})
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      copyData.splice(indexOfId, 1)
      
      setData(copyData)
      setPendingAction({mode: Status.Delete, comId})
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        currentUserData: currentUserData,
        replyTop: replyTop,
        data: data,
        handleAction: handleAction,
        editArr: editArr,
        onSubmit: onSubmit,
        onEdit: onEdit,
        replyArr: replyArr,
        onReply: onReply,
        onDelete: onDelete,
        customImg: customImg,
        inputStyle: inputStyle,
        formStyle: formStyle,
        submitBtnStyle: submitBtnStyle,
        cancelBtnStyle: cancelBtnStyle,
        imgStyle: imgStyle,
        commentsCount: commentsCount,
        onSubmitAction: onSubmitAction,
        onDeleteAction: onDeleteAction,
        onReplyAction: onReplyAction,
        onEditAction: onEditAction,
        replyInputStyle: replyInputStyle,
        removeEmoji: removeEmoji,
        advancedInput: advancedInput,
        placeHolder: placeHolder
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
