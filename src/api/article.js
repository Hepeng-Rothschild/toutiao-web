// 文章相关接口请求模块
import request from '@/utils/request'
export const getArticles = ({
  channel_id,
  timestamp,
  with_top
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    // query 参数放这里
    params: {
      channel_id, // 频道id
      timestamp,
      with_top
    },
    // body参数放这里
    data: {

    }
  })
}
// 举报文章
export const reportArticle = ({
  articleId,
  type,
  remark = null
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    // body参数放这里
    data: {
      target: articleId,
      type,
      remark
    }
  })
}
// 获取新闻文章详情
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`,
  })
}
// 对文章点赞
export const likeArticle = (articleId) => {
  return request({
    method: 'POST',
    url: ' /app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
// 对文章不喜欢
export const DisArticle = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data:{
      target: articleId
    }
  })
}
// 取消对文章点赞
export const unLikeArticle = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
// 取消对文章不喜欢
export const unDisArticle = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}