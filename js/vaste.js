/**
 * Created by voson on 2017/4/24.
 */

/*不显示进度环*/
NProgress.configure({showSpinner: false});

/*设置提示插件的显示位置和存在时间*/
toastr.options = {
    "positionClass": "toast-top-center",
    "timeOut": "1000",
    "preventDuplicates": true,
    "showMethod": "slideDown",
    "hideMethod": "fadeOut"
};

moment.locale('zh-cn');

var vaste = new Vue({
    el: '#text',
    data: {
        text: "",
        shortId: location.href.split("/", 4)[3],
        texts: []
    },
    mounted: function () {
        this.$nextTick(function () {

            this.findByShortID();
            /*setInterval(this.save, 1000);*/
        });
        this.getTexts();
    },
    computed:{
      processedTexts:function () {
          var _self=this;
          if (this.texts.length !== 0) {
              return bubbleSort(_self.texts,'updatetime').filter(function (a) {

                  //TODO  3.没截取到的文体用...代替
                  a.updatetime = moment(a.updatetime).fromNow();
                  if (a.text !== null) {
                      a.text = a.text.slice(0, 40);
                  }
                  return a;
              })
          } else {
              return null;
          }
      }
    },
    methods: {
        add: function () {
            var _self = this;
            $.ajax({
                type: "post",
                url: "/shortids",
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null) {
                        window.location.href = "/" + data;
                    } else {
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },
        clickSave: function () {
            var _self = this;
            $.ajax({
                type: "get",
                url: "/texts/" + _self.shortId,
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null && data !== "") {
                        _self.update();
                    } else {
                        _self.save();
                    }
                },
                error: function (data) {
                    toastr.error("保存失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },
        update: function () {
            var _self = this;
            $.ajax({
                type: "patch",
                url: "/texts/" + _self.shortId,
                data: {text: _self.text},
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null) {
                        toastr.success("更新成功！");
                    }
                },
                error: function (data) {
                    toastr.error("更新失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },
        save: function () {
            var _self = this;
            $.ajax({
                type: "post",
                url: "/texts",
                data: {text: _self.text, shortId: _self.shortId},
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null) {
                        toastr.success("保存成功！");
                    }
                },
                error: function (data) {
                    toastr.error("保存失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })


        },
        findByShortID: function () {
            var _self = this;

            /*nginx接收两种关于vaste.html的请求：domain/1234和domain/vaste.html 下面的判断即是确定如果是前者的话积极执行ajax请求*/
            /*domain/1234会被转成doamin?id=1234*/
            if (/\d{1,4}/i.test(_self.shortId)) {
                $.ajax({
                    type: "get",
                    url: "/texts/" + _self.shortId,
                    beforeSend: function () {
                        NProgress.start();
                    },
                    success: function (data) {
                        if (data !== null) {
                            _self.text = data.text;
                        } else {
                            console.log(data);
                        }
                    },
                    error: function (data) {
                        toastr.error("获取内容失败！");
                        console.log(data)
                    },
                    complete: function () {
                        NProgress.done();
                    }
                })
            }

        },
        getTexts: function () {
            var _self = this;
            $.ajax({
                type: "get",
                url: "/texts",
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null && data !== "") {
                        _self.texts = data;
                    } else {
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },

        deleteText: function () {
            var _self = this;
            window.location.href = "/vastelist.html";
            $.ajax({
                type: "DELETE",
                url: "/texts/" + _self.shortId,
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (typeof data === 'number') {
                        if (data === 0) {
                            toastr.warning("该记录不能存在！");
                        } /*else {
                            _self.text = "";
                        }*/
                    } else {
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        }

    }

});

