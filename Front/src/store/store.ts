// store.ts
import { createStore, Action } from 'redux';

// 초기 상태
const initialState = {
  userId: null as string | null,
  userSeq: null as number | null,
  role: null as string | null,
};

// 액션 타입
const SET_USER_ID = 'SET_USER_ID';
const SET_USER_SEQ = 'SET_USER_SEQ';
const SET_ROLE = 'SET_ROLE';

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

// 액션 타입을 통합
type MyActionTypes = setUserIdAction | SetUserSeqAction | SetRoleAction;

// 리듀서
const reducer = (state = initialState, action: MyActionTypes) => {
  switch (action.type) {
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    case SET_USER_SEQ:
      return { ...state, userSeq: action.payload };
    case SET_ROLE:
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

// 스토어 생성
const store = createStore(reducer);

export default store;
