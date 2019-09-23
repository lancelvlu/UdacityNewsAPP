// pages/news-detail/news-detail.js
let helperFunc = require("../../utils/util")

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    loadHidden: false,
    navBarInfo: {
      pageType: 1,
      pageTitle: "有信儿了",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      news_id: options.news_id,
    })
    this.getNewsDetail()
  },
  
  onPullDownRefresh: function () {
    this.getNewsDetail(() => {
      wx.stopPullDownRefresh()
    })
  },

  getNewsDetail: function(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.news_id,
      },
      success: (res) => {
        let results = res.data.result;
        // console.log(results);
        this.setDetailData(results);
        this.setData({
          loadHidden: true,
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setDetailData: function(results) {
    // console.log(results)
    let newsDate = new Date(results.date);
    let tempContent = [];
    for (let item of results.content) {
      if (item.type == "image"){
        let tempUrl = item.src;
        item.src = helperFunc.urlHelper(tempUrl)
      }
      tempContent.push(item)
    }
    this.setData({
      newsTitle: results.title,
      newsDate: `${newsDate.getFullYear()}-${newsDate.getMonth() + 1}-${newsDate.getDate()}`,
      picUrl: helperFunc.urlHelper(results.firstImage),
      readCount: `${results.readCount}阅读`,
      newsSource: results.source,
      newsContents: tempContent,
      navBarInfo: {
        pageType: 2,
        pageTitle: results.title,
      },
    })
  }
})
