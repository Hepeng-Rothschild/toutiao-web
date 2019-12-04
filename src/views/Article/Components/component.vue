<template>
  <div>
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了">
      <van-cell v-for="item in list"
                :key="item"
                :title="item">
        <van-image slot="icon"
                   round
                   width="30"
                   height="30"
                   style="margin-right: 10px;"
                   src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <span style="color: #466b9d;"
              slot="title">hello</span>
        <van-icon slot="right-icon"
                  name="like-o" />
      </van-cell>
    </van-list>

    <van-cell-group class="publish-wrap">
      <!-- 发布评论  -->
      <van-field clearable
                 placeholder="请输入评论内容"
                 v-model="commentText">
        <van-button slot="button"
                    size="mini"
                    type="info"
                    @click="onSubmitComment">发布</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import { getComments, addComment } from '@/api/comment'

export default {
  name: 'ArticleComment',
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      commentText: ''
    }
  },

  computed: {
    articleId () {
      return this.$route.params.id
    }
  },

  created () {
    this.loadComments()
  },

  methods: {
    // 发表评论需求
    async onSubmitComment () {
      // 获取文本框的内容-》提交评论-》加载评论列表

      const commentText = this.commentText.trim()
      if (!commentText.length) {
        return  
      }
      const { data } = await addComment({
        target: this.articleId,
        content: this.commentText
      })
      console.log(data);
    },
    async loadComments () {
      const { data } = await getComments({
        type: 'a',
        source: this.articleId
      })
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>