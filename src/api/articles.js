// 专门处理文章模块的请求列表
import request from '@/utils/request'
// 获取文章推荐数据
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
// 不感兴趣文章
export function dislike (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
// 封装举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
// 获取联想建议
export function suggest (params) {
  return request({
    url: '/suggestion',
    params// query参数放置在parmas
  })
}
// 搜索文章方法
export function searchArticle (params) {
  return request({
    url: '/search',
    params// 关键词 及分页信息
  })
}
// 文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`// 获取文章详情地址

  })
}
// 获取评论 或评论回复
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}
// 评论或者回复方法  支持两种场景1.文章评论 2.评论评论
export function commentOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
