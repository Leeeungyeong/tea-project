import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from './loading';

export default function createRequestSaga(type, request) {
    console.log('type');
    console.log(type);

    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    return function* (action) {
        yield put(startLoading(type)); //Loading start
        try {
            const response = yield call(request, action.payload);

            console.log('createRequestSaga');
            console.log(response);
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response,
            });
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true,
            });
        }
        yield put(finishLoading(type));
    };
}
