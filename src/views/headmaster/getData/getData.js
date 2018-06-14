import fetch from './fetch'



export const redirect = data => fetch('/api/oauth/create', data, 'POST');

export const getUser = data => fetch('/api/oauth/get_user', data, 'POST');
/**
 * 绑定登陆
 */
export const login = data => fetch('/api/head/bind', data, 'POST');

export const home = (data,token) => fetch('/api/head/general', data, 'POST',token);
/**
 * 学员分页
 */
export const stuList = (data,token) => fetch('/api/head/students', data, 'POST',token);
/**
 * 教练员分页
 */
export const coachList = (data,token) => fetch('/api/head/coachs', data, 'POST',token);
/**
 * 车辆分页
 */
export const carList = (data,token) => fetch('/api/head/cars', data, 'POST',token);
/**
 * 训练场分页
 */
export const trainsiteList = (data,token) => fetch('/api/head/trainsites', data, 'POST',token);

export const logout = (data,token) => fetch('/api/head/unbind', data, 'POST',token);
/**
 * 获取部门分页
 * **/
export const getDepartmentList = (data,token) => fetch('/api/head/get_branch', data, 'POST',token);
/**
 * 获取教练申请审核
 * **/
export const getCoachAskList = (data,token) => fetch('/api/head/list_asks', data, 'POST',token);
/**
 * 审批休息申请
 * **/
export const handleAskOff = (data,token) => fetch('/api/head/handle_askoff', data, 'POST',token);
/**
 * 审批加班申请
 * **/
export const handleAddWork = (data,token) => fetch('/api/head/handle_addwork', data, 'POST',token);

/**
 * 教练评价
 * **/
export const getCoachEvals = (data,token) => fetch('/api/head/coach_evals', data, 'POST',token);