//顶部导航tab和下方的滑动切换参考https://blog.csdn.net/Sophie_U/article/details/71745125?fps=1&locationNum=1
const app = getApp()

const typeName = {
  0: "gn",
  1: "gj",
  2: "cj",
  3: "yl",
  4: "js",
  5: "ty",
  6: "other",
}

//导入helperFunc，其中包含要使用到的urlHelper对image的url进行处理
let helperFunc = require("../../utils/util")

Page({
  data: {
    loadHidden: false,
    defaultCoverPath: "/images/default-cover.jpeg",
    winHeight: "",//窗口高度
    currentTab: 0, //初始的tab标签
    scrollLeft: 0, //tab标签的滚动条位置
    tabList: [{ label: 0, abbre: "gn", name: "国内" },
    { label: 1, abbre: "gj", name: "国际" },
    { label: 2, abbre: "cj", name: "财经" },
    { label: 3, abbre: "yl", name: "娱乐" },
    { label: 4, abbre: "js", name: "军事" },
    { label: 5, abbre: "ty", name: "体育" },
    { label: 6, abbre: "other", name: "其他" }],
    navBarInfo: {
      pageType: 1,
      pageTitle: "有信儿了",
    },
    bottomNoMoreLabel: false,
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.getNewsList();
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  switchNav: function (e) {
    var cur = e.target.dataset.current;
    this.getNewsList();
    if (this.data.currentTab != cur)
    {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //获取新闻列表
  getNewsList(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: typeName[this.data.currentTab]
      },
      success: (res) => {
        let results = res.data.result;
        this.setData({
          newsContent: this.ListDataParser(results)
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  //刷新新闻列表
  refreshNewsList(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: typeName[this.data.currentTab]
      },
      success: (res) => {
        let results = res.data.result;
        let tempNewList = this.ListDataParser(results)
        if (tempNewList.length == this.data.newsContent.length){
              this.setData(
                { refreshNewLabel: true }
              )
            } else{
              this.setData(
                {
                  newsContent: tempNewList, 
                  refreshNewLabel: false
                }
              )
            }  
        },
      complete: () => {
        callback && callback()
      }
    })
  },

  //加载更多新闻
  loadMoreNewsList() {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: typeName[this.data.currentTab]
      },
      success: (res) => {
        let results = res.data.result;
        let tempNewList = this.ListDataParser(results)
        let newsContent = this.data.newsContent
        let oldLength = newsContent.length
        let oldIdSet = new Set(this.data.newsContent.map(a => a.newsId))
        for (let tempNews of tempNewList){
          if (!oldIdSet.has(tempNews.newsId)){
            newsContent.push(tempNews)
          }
        }
        if (newsContent.length == oldLength){
          this.setData({
          bottomNoMoreLabel: true
          })
        } else{
          this.setData({
            newsContent: newsContent
          })
        }
      },
    })
  },
  
  //对服务器返回的新闻列表信息进行解析
  ListDataParser: function (results) {
    let newsContent = [];
    for (let item of results) {
      let newsDate = new Date(item.date);
      var coverPath = "";
      if (item.firstImage) {
        coverPath = helperFunc.urlHelper(item.firstImage);
      } else {
        coverPath = this.data.defaultCoverPath;
      };
      newsContent.push({
        newsTitle: item.title,
        newsDate: `${newsDate.getFullYear()}-${newsDate.getMonth() + 1}-${newsDate.getDate()}`,
        coverImageUrl: coverPath,
        newsSource: item.source,
        newsId: item.id
      })
    };
    return newsContent
  },

  imageErrorFunction: function (event) {
    var index = event.currentTarget.dataset.index
    // 将无法加载的封面替换为本地默认图片
    var img = 'newsContent[' + index + '].coverImageUrl'
    this.setData({
      [img]: this.data.defaultCoverPath,
    })
  },

  onTapNewsDetail(event) {
    this.setData({
      news_id: event.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: "/pages/news-detail/news-detail?news_id=" + this.data.news_id,
    })
  },

  onLoad: function () {
    this.getHotTopic()
    this.getNewsList()
    // 根据不同的设备计算scroll-view的高度，目标为超出屏幕一点点，这样才能触发onReachBottom
    wx.getSystemInfo({
      success: (res) => {
        // 设备总高度为 app.globalData.clientHeight, 单位px
        // 新闻类别导航栏（class:tab-h）的高度为80rpx
        // 热点新闻展示窗口（class:head）的高度为360rpx
        // 预留50rpx确保所有内容超出一个屏幕
        // 所有px通过乘rpxRate转换为rpx
        let winHeight = (app.globalData.clientHeight - app.globalData.navHeight)* app.globalData.rpxRate - 360 - 80 + 50;
        let bottomPadding = 0;
        // iPhone X、iPhone XR等设备屏幕最下方系统自带条形图标会挡住某些内容，增加padding-bottom来避免 
        if (app.globalData.deviceType == 1) { bottomPadding = 20}
        this.setData({
          winHeight: winHeight,
          bottomPadding: bottomPadding,
        });
      }
    });
  },
  //获取所有页面信息并排序获得阅读量前三的新闻
  getHotTopic() {
    let tempList = []
    var tempList2 = []
    for (let item of this.data.tabList) {
      tempList.push(helperFunc.hotTopicListHelper(item.abbre))
    }
    Promise.all(tempList).then((result) => {
      let tempList_inner = []
      for (let item of result) {
        tempList_inner = tempList_inner.concat(item)
      }
      let detailPromiseList = []
      for (let item of tempList_inner) {
        detailPromiseList.push(helperFunc.hotTopicDetailHelper(item))
      }
      Promise.all(detailPromiseList).then((results) => {
        let totalNewsInfoList = results.sort((a, b) => { return b.readCount - a.readCount })
        this.setData({
          loadHidden: true,
          myData: totalNewsInfoList.slice(0, 3)
        })
      })
    })
  },

  onPullDownRefresh: function(){
    this.refreshNewsList(() => {
      wx.stopPullDownRefresh()
      // console.log(this.data.refreshNewLabel)
      if (this.data.refreshNewLabel){
        wx.showToast({
          title: "没有新信儿了",
          icon: "none",
        })
      }
    }) 
  },
  
  onReachBottom: function(){
    this.loadMoreNewsList()
  }
})