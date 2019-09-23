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

  onPullDownRefresh: function () {
    this.getNewsList(() => {
      wx.stopPullDownRefresh()
    })
  },
  
  getNewsList(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: typeName[this.data.currentTab]
      },
      success: (res) => {
        let results = res.data.result;
        this.setListData(results)
        // console.log(results)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  imageErrorFunction: function (event) {
    var index = event.currentTarget.dataset.index
    // 将无法加载的封面替换为本地默认图片
    var img = 'newsContent[' + index + '].coverImageUrl'
    this.setData({
      [img]: this.data.defaultCoverPath,
    })
  },

  setListData(results) {
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
    this.setData(
      { newsContent: newsContent }
    )
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
    // console.log(this.data.hotTopic.length)
    // console.log(this.data.hotTopic)
    this.getNewsList()
    // 计算自适应屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        console.log(app.globalData.rpxRate)
        // let clientHeight = res.windowHeight, clientWidth = res.windowWidth, rpxR = 750 / clientWidth;
        let winHeight = (app.globalData.clientHeight - app.globalData.navHeight)* app.globalData.rpxRate - 440;
        this.setData({
          winHeight: winHeight
        });
      }
    });
  },
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
        console.log(this.data.myData)
      })
    })
  },

  onPullDownRefresh: function(){
    this.getNewsList(() => {
      wx.stopPullDownRefresh()
    })
  },
})