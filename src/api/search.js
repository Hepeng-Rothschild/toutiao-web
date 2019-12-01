// 搜索相关接口
import request from '@/utils/request'
export const getSuggestion = (q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
// 获取搜索结果
export const getSearch = ({
  q,
  page = 1,
  perPage = 10
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      q,
      page,
      per_page:perPage
    }
  })
}
