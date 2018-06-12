import fetch from './fetch'

/**
 * 登陆
 */
export const redirect = data => fetch('/api/oauth/create', data, 'POST');

export const getUser = data => fetch('/api/oauth/get_user', data, 'POST');
/**
 * 绑定登陆
 */
export const login = data => fetch('/api/stu/bind', data, 'POST');
/**
 * 培训信息
 */
export const trainInfo = (data,token) => fetch('/api/stu/train_general', data, 'POST',token);

/**
 * 培训详情
 */
export const trainDetail = (data,token) => fetch('/api/stu/train_detail', data, 'POST',token);
/**
 * 考试详情
 */
export const examDetail = (data,token) => fetch('/api/stu/exam_detail', data, 'POST',token);
/**
 * 预约培训的教练员list
 */
export const bookCoachList = (data,token) => fetch('/api/stu/search_coach', data, 'POST',token);
/**
 * 预约培训的教练员的预约详情
 */
export const bookCoachDetail = (data,token) => fetch('/api/stu/coach_plan', data, 'POST',token);
/**
 * 预约动作
 */
export const preBook = (data,token) => fetch('/api/stu/prebook', data, 'POST',token);
/**
 * 我的预约详情
 */
export const myPreBook = (data,token) => fetch('/api/stu/my_prebook', data, 'POST',token);
/**
 * 预约订单详情
 */
export const preBookDetail = (data,token) => fetch('/api/stu/prebook_detail', data, 'POST',token);
/**
 * 取消订单
 */
export const cancelPreBook = (data,token) => fetch('/api/stu/cancel_prebook', data, 'POST',token);
/**
 * 评价订单
 */
export const evaluateOrder = (data,token) => fetch('/api/stu/eval_order', data, 'POST',token);
/**
 * 支付接口  获取信息
 */
export const getUnified = (data,token) => fetch('/api/stu/get_unified', data, 'POST',token);

export const logout = (data,token) => fetch('/api/stu/unbind', data, 'POST',token);

/**
 * 修改密码
 */
export const modifyPwd = (data,token) => fetch('/api/stu/modify_pwd', data, 'POST',token);
/**
 * 验证身份信息
 */
export const validateStu = (data,token) => fetch('/api/stu/validate_stu', data, 'POST');
/**
 * 忘记密码
 */
export const forgetPwd = (data,token) => fetch('/api/stu/forget_pwd', data, 'POST');
/**投诉
 * */
export const complaint = (data,token) => fetch('/api/stu/complaint', data, 'POST',token);