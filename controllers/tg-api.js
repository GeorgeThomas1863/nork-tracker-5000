import TgReq from "../models/tg-model.js";

let tokenIndex = 0;

//DEAL WITH TOKEN Index HERE
export const sendMessageChunkTG = async (params) => {
  const tgModel = new TgReq(params);

  //check token
  let data = await tgModel.tgPost("sendMessage", tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPost("sendMessage", tokenIndex); //run again

  return data;
};

export const uploadPicsTG = async (params) => {
  const tgModel = new TgReq(params);

  //check token
  let data = await tgModel.tgPicFS(tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPicFS(tokenIndex); //run again

  return data;
};

export const editCaptionTG = async (inputObj, caption) => {
  //build params
  const params = {
    chat_id: inputObj.result.chat.id,
    message_id: inputObj.result.message_id,
    caption: caption,
  };

  const tgModel = new TgReq(params);

  let data = await tgModel.tgPost("editMessageCaption", tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPost("editMessageCaption", tokenIndex); //if fucked run again

  return data;
};

//CHECK TOKEN
const checkToken = async (data) => {
  //429 bot fucked error
  if (!data || (data && data.ok) || (data && !data.ok && data.error_code !== 429)) return null;

  //otherwise bot fucked
  console.log("AHHHHHH");

  tokenIndex++;
  if (tokenIndex > 11) tokenIndex = 0;

  console.log("GOT 429 ERROR, TRYING NEW FUCKING BOT. TOKEN INDEX: " + tokenIndex);
  return tokenIndex;
};

export default sendMessageChunkTG;
