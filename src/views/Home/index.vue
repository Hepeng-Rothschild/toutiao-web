<template>
  <div>
    <van-nav-bar fixed>
      <van-button color="#5bafb"
                  size="small"
                  class="search-btn"
                  slot="title"
                  icon="search"
                  type="primary"
                  round
                  @click="$router.push({name:'search'})">
        搜索
      </van-button>
    </van-nav-bar>
    <van-tabs v-model="activeChannelIndex">
      <div slot="nav-right"
           class="wap-nav"
           @click="isChannelEditShow = true">
        <van-icon size="24"
                  name="wap-nav" />
      </div>
      <van-tab :title="channel.name"
               v-for="channel in channels"
               :key="channel.id">
        <van-pull-refresh v-model="channel.pullLoading"
                          @refresh="onRefresh">
          <van-list v-model="channel.loading"
                    :finished="channel.finished"
                    finished-text="没有更多了"
                    @load="onLoad">
            <van-cell v-for="article in channel.articles"
                      :key="article.art_id.toString()"
                      :title="article.title"
                      @click="$router.push({name:'article',params:{id:article.art_id.toString()}})">
              <div slot="label">
                <van-grid :border="false"
                          :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images"
                                 :key="index">
                    <van-image height="80"
                               :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}评论</span>
                    <span>{{article.pubdate | relativeTime}}</span>
                    <van-icon name="close"
                              class="van-icon"
                              @click="onClose(article)" />
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 举报弹窗 -->
    <van-dialog v-model="isReportShow"
                :show-cancel-button="false"
                :show-confirm-button="false"
                close-on-click-overlay>
      <van-cell-group v-if="!isRubbishShow">
        <van-cell title="反馈垃圾内容"
                  icon="location-o"
                  is-link
                  @click="isRubbishShow = true" />
        <van-cell title="拉黑作者"
                  icon="location-o"
                  @click="onAddBlackLists" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left"
                  @click="isRubbishShow = false" />
        <van-cell :title="item.label"
                  v-for="item in reportTypes"
                  :key="item.value"
                  @click="onReportArticle(item.value)" />
      </van-cell-group>
    </van-dialog>
    <!-- 编辑频道组件 -->
    <channel-edit v-model="isChannelEditShow"
                  :my-channels="channels"
                  :active-index="activeChannelIndex"
                  @update-active="activeChannelIndex = $event" />
  </div>
</template>

<script>
import { getDefaultOrUserChannels } from '@/api/channel'
import { getArticles, reportArticle } from '@/api/article'
import { addBlackLists } from '@/api/user'
import { log } from 'util';
import channelEdit from './Components/channel-edit'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  components: {
    channelEdit
  },
  data () {
    return {
      activeChannelIndex: 0, // 当前激活频道索引
      channels: [], // 频道列表数组
      isReportShow: false, // 控制举报弹窗是否显示
      isRubbishShow: false, // 控制垃圾内容是否显示
      currentArticle: null,
      reportTypes: [
        { label: '标题夸张', value: 1 },
        { label: '低俗下贱', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧闻重复', value: 4 }
      ],
      isChannelEditShow: false,

    }
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  async created () {
    await this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        const { data } = await getDefaultOrUserChannels()
        channels = data.data.channels
      } else {
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          const { data } = await getDefaultOrUserChannels()
          channels = data.data.channels
        }
      }
      // 给每一个分栏创建自己的文章列表
      channels.forEach(channel => {
        channel.articles = [] //存储各自的文章列表
        channel.finished = false // 存储频道各自是否加载完毕的状态
        channel.loading = false // 存储频道各自的上拉加载更多的loading状态
        channel.pullLoading = false // 存储频道各自的下拉刷新loading状态
        channel.timestamp = null // 存储当前频道加载下一页数据的时间戳标志
      })
      this.channels = channels
    },
    // 页面清单加载
    async onLoad () {
      const { currentChannel } = this
      const { data } = await getArticles({
        channel_id: currentChannel.id,
        timestamp: currentChannel.timestamp || Date.now(),
        with_top: 1
      })
      const { results, pre_timestamp } = data.data
      // 将获取到的文章列表添加到当前频道中
      currentChannel.articles.push(...results)
      if (pre_timestamp) {
        // 将本次请求的时间戳备份起来，用于请求下一页数据的参数标志
        currentChannel.pre_timestamp = pre_timestamp
      } else {
        currentChannel.finished = true // 没有数据，就结束onload
      }

      // 本次加载更多ok了，将本次的loading设置为false
      currentChannel.loading = false
    },
    // 页面刷新加载过程
    async onRefresh () {
      const { currentChannel } = this
      const { data } = await getArticles({
        channel_id: currentChannel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 下拉刷新，将每次拿到的数据放到当前频道的文章的顶部
      currentChannel.articles.unshift(...data.data.results)
      // 数据加载完毕，将当前频道的下拉刷新loading关闭
      currentChannel.pullLoading = false
      this.$toast('刷新成功')
    },
    // 关闭举报按钮的弹框
    onClose (article) {
      this.isReportShow = true
      this.currentArticle = article
    },
    // 拉黑作者操作
    async onAddBlackLists () {
      const autId = this.currentArticle.aut_id
      const { data } = await addBlackLists(autId)
      // 将拉黑作者的文章从客户端移除
      this.channels.forEach(channel => {
        const articles = channel.articles
        for (let i = 0; i < articles.length; i++) {
          const article = articels[i]
          if (article.aut_id === autId) {
            articels.splice(i, 1)
            i--
          }
        }
      })
      this.$toast('拉黑成功，将减少此类内容推送')
      this.isReportShow = false // 拉黑成功，关闭弹窗 
    },
    // 反馈垃圾内容操作
    async onReportArticle (type) {
      try {
        const { data } = await reportArticle({
          articleId: this.currentArticle.art_id.toString(),
          type
        })
        this.$toast('举报成功')
      } catch (error) {
        console.log(err);
        this.$toast('已经举报过了')
      }
      // 只要举报过后，就关闭弹框
      this.isReportShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs /deep/ .van-tabs__wrap--scrollable {
  position: fixed;
  top: 46px;
  left: 0;
  right: 16px;
  z-index: 2;
}
.van-tabs /deep/ .van-tabs__content {
  margin-top: 90px;
}
.article-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .meta span {
    margin-right: 10px;
  }
}
.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
}
</style>
