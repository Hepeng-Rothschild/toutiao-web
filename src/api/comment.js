// 评论接口模块
import request from '@/utils/request'
// 获取文章评论或评论回复
export const getComments = ({
  type,
  source,
  offset = null,
  limit = null
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}
// 添加文章评论或评论回复
export const addComment = ({
  target,
  content,
  art_id = null
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    params: {
      target,
      content,
      art_id
    }
  })
}
