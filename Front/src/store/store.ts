// store.ts
import { createStore, Action } from 'redux';

// 초기 상태
const initialState = {
  myId: null as string | null,
};

// 액션 타입
const SET_MY_ID = 'SET_MY_ID';

// 액션 생성자
export const setMYId = (myId: string | null) => ({
  type: SET_MY_ID,
  payload: myId,
});

// 액션 타입 인터페이스 정의
interface SetMyIdAction extends Action {
  type: typeof SET_MY_ID;
  payload: string | null;
}

// 액션 타입을 통합
type MyActionTypes = SetMyIdAction;

// 리듀서
const reducer = (state = initialState, action: MyActionTypes) => {
  switch (action.type) {
    case SET_MY_ID:
      return { ...state, myId: action.payload };
    default:
      return state;
  }
};

// 스토어 생성
const store = createStore(reducer);

export default store;
