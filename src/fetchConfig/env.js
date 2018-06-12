/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl='http://192.168.2.109:8021';
let frontWebUrl = 'http://192.168.2.149:8091';
if(process.env.NODE_ENV === 'production'){

    frontWebUrl='http://wechatdt.xingteam.com';
    baseUrl='http://wechatdt.xingteam.com:8101';
    // baseUrl='http://192.168.2.114:8021';
    // frontWebUrl = 'http://192.168.2.114:8091';
}
let routerMode = 'history';



export {
    frontWebUrl,
    baseUrl,
	routerMode,
}
