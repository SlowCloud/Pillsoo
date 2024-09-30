// store.ts
import {createStore, Action} from 'redux';

interface CheckAlarmType {
  id: number;
}

// 초기 상태
const initialState = {
  userId: null as string | null,
  userSeq: null as number | null,
  role: null as string | null,
  age: null as number | null,
  nickname: null as string | null,
  gender: null as string | null,
  // 알람 설정 모달
  openModal: false,
  // 알람을 수정 or 삭제 한 후 재렌더링 할 때 필요
  resetAlarm: false,
  fcmToken: null as string | null,
};

// 액션 타입
const SET_USER_ID = 'SET_USER_ID';
const SET_USER_SEQ = 'SET_USER_SEQ';
const SET_ROLE = 'SET_ROLE';
const SET_AGE = 'SET_AGE';
const SET_NICKNAME = 'SET_NICKNAME';
const SET_GENDER = 'SET_GENDER';
const SET_OPEN_MODAL = 'SET_OPEN_MODAL';
const SET_RESET_ALARM = 'SET_RESET_ALARM';
const SET_FCM_TOKEN = 'SET_FCM_TOKEN';

// 액션 생성자
export const setUserId = (userId: string | null) => ({
  type: SET_USER_ID,
  payload: userId,
});

export const setUserSeq = (userSeq: number | null) => ({
  type: SET_USER_SEQ,
  payload: userSeq,
});

export const setRole = (role: string | null) => ({
  type: SET_ROLE,
  payload: role,
});

export const setAge = (age: number | null) => ({
  type: SET_AGE,
  payload: age,
});

export const setNickname = (nickname: string | null) => ({
  type: SET_NICKNAME,
  payload: nickname,
});
export const setGender = (gender: string | null) => ({
  type: SET_GENDER,
  payload: gender,
});
export const setOpenModal = (openModal: boolean) => ({
  type: SET_OPEN_MODAL,
  payload: openModal,
});
export const setResetAlarm = (resetAlarm: boolean) => ({
  type: SET_RESET_ALARM,
  payload: resetAlarm,
});
export const setFcmToken = (fcmToken: string | null) => ({
  type: SET_FCM_TOKEN,
  payload: fcmToken,
});

// 액션 타입 인터페이스 정의
interface setUserIdAction extends Action {
  type: typeof SET_USER_ID;
  payload: string | null;
}

interface SetUserSeqAction extends Action {
  type: typeof SET_USER_SEQ;
  payload: number | null;
}

interface SetRoleAction extends Action {
  type: typeof SET_ROLE;
  payload: string | null;
}

interface SetAgeAction extends Action {
  type: typeof SET_AGE;
  payload: number | null;
}

interface SetNicknameAction extends Action {
  type: typeof SET_NICKNAME;
  payload: string | null;
}
interface SetGenderAction extends Action {
  type: typeof SET_GENDER;
  payload: string | null;
}
interface setOpenMIdalAction extends Action {
  type: typeof SET_OPEN_MODAL;
  payload: boolean;
}
interface setResetAlarmAction extends Action {
  type: typeof SET_RESET_ALARM;
  payload: boolean;
}
interface setFcmTokenAction extends Action {
  type: typeof SET_FCM_TOKEN;
  payload: string | null;
}


// 액션 타입을 통합
type MyActionTypes = 
  | setUserIdAction 
  | SetUserSeqAction 
  | SetRoleAction 
  | SetAgeAction 
  | SetNicknameAction 
  | SetGenderAction
  | setOpenMIdalAction
  | setResetAlarmAction
  | setFcmTokenAction;


// 리듀서
const reducer = (state = initialState, action: MyActionTypes) => {
  switch (action.type) {
    case SET_USER_ID:
      return {...state, userId: action.payload};
    case SET_USER_SEQ:
      return {...state, userSeq: action.payload};
    case SET_ROLE:
      return {...state, role: action.payload};
    case SET_AGE:
      return {...state, age: action.payload};
    case SET_NICKNAME:
      return {...state, nickname: action.payload};
    case SET_GENDER:
      return {...state, gender: action.payload};
    case SET_OPEN_MODAL:
      return {...state, openModal: action.payload};
    case SET_RESET_ALARM:
      return {...state, resetAlarm: action.payload};
    case SET_FCM_TOKEN:
      return {...state, fcmToken: action.payload};
    default:
      return state;
  }
};

// 스토어 생성
const store = createStore(reducer);

export default store;
