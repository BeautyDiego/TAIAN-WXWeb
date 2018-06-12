import fetch from './fetch'

/**
 * 登陆
 */
export const redirect = data => fetch('/api/oauth/create', data, 'POST');

export const getUser = data => fetch('/api/oauth/get_user', data, 'POST');
/**
 * 绑定登陆
 */
export const login = data => fetch('/api/coach/bind', data, 'POST');
/**
 * 我的考勤
 */
export const myattendence = (data,token) => fetch('/api/coach/get_module', data, 'POST',token);
/**
 * 获取考勤时间段
 */
export const getDayHour = (data,token) => fetch('/api/coach/get_dayhour', data, 'POST',token);
/**
 * 设置考勤
 */
export const setattendence = (data,token) => fetch('/api/coach/set_module', data, 'POST',token);
/**
 * 发布月度计划
 */
export const releaseMonthPlan = (data,token) => fetch('/api/coach/release_plan', data, 'POST',token);
/**
 * 获取月度计划
 */
export const getMonthPlan = (data,token) => fetch('/api/coach/get_plan', data, 'POST',token);
/**
 * 获取某个时段的预约详情
 */
export const getDayPlanDetail = (data,token) => fetch('/api/coach/dayspan_detail', data, 'POST',token);
/**
 * 请假
 */
export const askOff = (data,token) => fetch('/api/coach/ask_off', data, 'POST',token);
/**
 * 加班
 */
export const addWork = (data,token) => fetch('/api/coach/add_work', data, 'POST',token);
/**
 * 取消请假
 */
export const cancelAskOff = (data,token) => fetch('/api/coach/cancel_askoff', data, 'POST',token);
/**
 * 取消加班
 */
export const cancelAddWork = (data,token) => fetch('/api/coach/cancel_addwork', data, 'POST',token);
/**
 * 考勤审核列表
 */
export const changeHistory = (data,token) => fetch('/api/coach/change_history', data, 'POST',token);
/**
 * 取消考勤审核
 */
export const cancelExamineAsk = (data,token) => fetch('/api/coach/cancel_ask', data, 'POST',token);
/**
 * 预约的详情
 */
export const reservationDetail = (data,token) => fetch('/api/coach/my_prebook', data, 'POST',token);
/**
 * 教练员完成培训或未完成培训
 */
export const setPrebook = (data,token) => fetch('/api/coach/set_prebook', data, 'POST',token);

export const logout = (data,token) => fetch('/api/coach/unbind', data, 'POST',token);
/**
 * 修改密码
 */
export const modifyPwd = (data,token) => fetch('/api/coach/modify_pwd', data, 'POST',token);
/**
 * 验证身份信息
 */
export const validateCoach = (data,token) => fetch('/api/coach/validate_coach', data, 'POST');
/**
 * 忘记密码
 */
export const forgetPwd = (data,token) => fetch('/api/coach/forget_pwd', data, 'POST');