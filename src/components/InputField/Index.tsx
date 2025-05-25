import './InputField.scss'
import React, { useContext, useEffect, useState, FormEvent } from 'react'

import { GlobalContext } from '../../context/Provider'
import RegularInput from './RegularInput'
import AdvancedInput from './AdvancedInput'

const { v4: uuidv4 } = require('uuid')

interface InputFieldProps {
  formStyle?: object
  comId?: string
  fillerText?: string
  parentId?: string
  mode?: string
  customImg?: string
  inputStyle?: object
  cancelBtnStyle?: object
  submitBtnStyle?: object
  imgStyle?: object
  imgDiv?: object
  placeHolder?: string
}

const InputField = ({
  formStyle,
  comId,
  fillerText,
  parentId,
  mode,
  customImg,
  inputStyle,
  cancelBtnStyle,
  submitBtnStyle,
  imgStyle,
  imgDiv,
  placeHolder
}: InputFieldProps) => {
  const [text, setText] = useState('')

  useEffect(() => {
    if (fillerText) {
      setText(fillerText)
    }
  }, [fillerText])

  const globalStore: any = useContext(GlobalContext)

  const editMode = async (advText?: string) => {
    const textToSend = advText ? advText : text

    console.log(">> editMode");

    // Call the main edit function
    await globalStore.onEdit(textToSend, comId, parentId);

    // Optionally call additional edit action
    if (globalStore.onEditAction) {
      await globalStore.onEditAction({
        userId: globalStore.currentUserData.currentUserId,
        comId,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        userProfile: globalStore.currentUserData.currentUserProfile || null,
        fullName: globalStore.currentUserData.currentUserFullName,
        text: textToSend,
        parentOfEditedCommentId: parentId,
      });
    }
  }

  const replyMode = async (replyUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text

    // Submit the reply
    await globalStore.onReply(textToSend, comId, parentId, replyUuid);

    // Submit the optional reply action
    if (globalStore.onReplyAction) {

      console.log(">> replyMode :", textToSend, comId, parentId, replyUuid);
      await globalStore.onReplyAction({
        userId: globalStore.currentUserData.currentUserId,
        repliedToCommentId: comId,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        userProfile: globalStore.currentUserData.currentUserProfile
          ? globalStore.currentUserData.currentUserProfile
          : null,
        fullName: globalStore.currentUserData.currentUserFullName,
        text: textToSend,
        parentOfRepliedCommentId: parentId,
        comId: replyUuid,
      });
    }

    // return (
    //   await globalStore.onReply(textToSend, comId, parentId, replyUuid),
    //   globalStore.onReplyAction &&
    //     (await globalStore.onReplyAction({
    //       userId: globalStore.currentUserData.currentUserId,
    //       repliedToCommentId: comId,
    //       avatarUrl: globalStore.currentUserData.currentUserImg,
    //       userProfile: globalStore.currentUserData.currentUserProfile
    //         ? globalStore.currentUserData.currentUserProfile
    //         : null,
    //       fullName: globalStore.currentUserData.currentUserFullName,
    //       text: textToSend,
    //       parentOfRepliedCommentId: parentId,
    //       comId: replyUuid
    //     }))
    // )
  }

  const submitMode = async (createUuid: string, advText?: string): Promise<void> => {
    const textToSend = advText ? advText : text

    console.log(">> submitMode");
  
    // Submit main text
    await globalStore.onSubmit(textToSend, createUuid);
  
    // Optionally submit additional action
    if (globalStore.onSubmitAction) {
      await globalStore.onSubmitAction({
        userId: globalStore.currentUserData.currentUserId,
        comId: createUuid,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        userProfile: globalStore.currentUserData.currentUserProfile ? globalStore.currentUserData.currentUserProfile : null,
        fullName: globalStore.currentUserData.currentUserFullName,
        text: textToSend,
        replies: [],
      });
    }
  };
  
  const handleSubmit = async ( event: FormEvent<HTMLFormElement>, advText?: string ) => {
    event.preventDefault();
    const createUuid = uuidv4();
    const replyUuid = uuidv4();
    switch (mode) {
      case 'editMode':
        editMode(advText);
        break;
      case 'replyMode':
        replyMode(replyUuid, advText);
        break;
      default:
        submitMode(createUuid, advText);
        break;
    }
    setText('');
  };

  return (
    <div>
      {globalStore.advancedInput ? (
        <AdvancedInput
          handleSubmit={handleSubmit}
          text={mode === 'editMode' ? text : ''}
          formStyle={formStyle}
          mode={mode}
          cancelBtnStyle={cancelBtnStyle}
          submitBtnStyle={submitBtnStyle}
          comId={comId}
          imgDiv={imgDiv}
          imgStyle={imgStyle}
          customImg={customImg}
          placeHolder={placeHolder}
        />
      ) : (
        <RegularInput
          formStyle={formStyle}
          imgDiv={imgDiv}
          imgStyle={imgStyle}
          customImg={customImg}
          mode={mode}
          inputStyle={inputStyle}
          cancelBtnStyle={cancelBtnStyle}
          comId={comId}
          submitBtnStyle={submitBtnStyle}
          handleSubmit={handleSubmit}
          text={text}
          setText={setText}
          placeHolder={placeHolder}
        />
      )}
    </div>
  )
}
export default InputField
