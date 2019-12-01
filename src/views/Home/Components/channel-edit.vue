<template>
  <van-popup :style="{ height: '95%' }"
             :value="value"
             @input="$emit('input',$event)"
             position="bottom"
             round>
    <van-cell icon="cross"
              @click="$emit('input',false)" />
    <van-cell title="我的频道"
              label="点击进入频道">
      <van-button round
                  type="danger"
                  size="mini"
                  @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid>
      <van-grid-item v-for="(channel,index) in myChannels"
                     :key="channel.id"
                     :title="channel.name"
                     @click="onMyChannelItemClick(index)">
        <span class="grid-text"
              :class="{active: index === activeIndex}">{{channel.name}}</span>
        <van-icon v-show="isEdit"
                  class="close-icon"
                  name="close" />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道"
              label="点击添加频道" />
    <van-grid>
      <van-grid-item v-for="channel in recommendChannels"
                     :key="channel.id"
                     @click="onAddChannel(channel)"
                     :text="channel.name" />
    </van-grid>
  </van-popup>
</template>

<script>
import { getAllChannels, deleteUserChannel, addUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  // 接收父组件传过来的值
  props: {
    value: {
      type: Boolean,
      default: false
    },
    myChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,
    }
  },
  computed: {
    // 映射进来
    ...mapState(['user']),
    // 推荐频道列表
    recommendChannels () {
      // 先得到我的频道列表的所有频道id
      const ids = this.myChannels.map(channel => channel.id)
      // 然后从所有频道列表中进行过滤
      const ret = this.allChannels.filter(channel => {
        return !ids.includes(channel.id)
        console.log(ret);

      })
      return ret
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      const channels = data.data.channels
      channels.forEach(channel => {
        channel.articles = [] //存储各自的文章列表
        channel.finished = false // 存储频道各自是否加载完毕的状态
        channel.loading = false // 存储频道各自的上拉加载更多的loading状态
        channel.pullLoading = false // 存储频道各自的下拉刷新loading状态
        channel.timestamp = null // 存储当前频道加载下一页数据的时间戳标志
      })
      this.allChannels = data.data.channels
    },
    // 添加频道操作
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        // 如果登录了，请求保存到后端数据库
        addUserChannel(channel.id, this.myChannels.length)
      } else {
        // 没有登录，则保存到本地存储
        window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
      }
    },
    // 删除频道操作
    async onMyChannelItemClick (channelId, index) {
      // 如果是编辑状态，则执行删除操作
      if (this.isEdit) {
        this.myChannels.splice(index, 1)
        if (this.user) {
          // 请求保存到后端
          await deleteUserChannel(channelId)
        } else {
          // 没有登录，保存到本地存储
          window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
        }
      } else {
        // 非编辑状态，则执行切换频道操作
        this.$emit('update-active', index)
        // 关闭弹框
        this.$emit('input', false)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    .title {
      font-size: 15px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
}
.channel-content {
  .text {
    font-size: 16px;
  }
  .active {
    color: red;
  }
  .close-icon {
    font-size: 20px;
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 999;
    background-color: #fff;
  }
  .info {
    display: flex;
    align-items: center;
  }
}
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.active {
  color: red;
}
</style>
