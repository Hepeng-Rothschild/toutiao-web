// 频道接口
import request from '@/utils/request'
//获取默认推荐的频道列表或者用户列表，后端会根据token识别用户
export const getDefaultOrUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 删除指定用户频道
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
// 添加指定用户频道
export const addUserChannel = (channelId, seq) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [{
        id: channelId,
        seq
      }]
    }
  })
}
