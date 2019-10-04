const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    navbarInfo: {
      type: Object,
      value: {
        // pageType为1则为首页，为2则为详情页，详情页提供返回按钮
        pageType: "1",
        pageTitle: "有信儿了",
      },
    }
  },
  data: {
    statusBarHeight: app.globalData.statusBarHeight * app.globalData.rpxRate,
    titleBarHeight: app.globalData.titleBarHeight * app.globalData.rpxRate
  },
  methods: {
    //返回上一页
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _backhome() {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  }
})