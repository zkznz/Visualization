<template>
    <div class="container">
        <div class="title" :style="comStyle">
            <span>{{ '▎ ' + showTitle }}</span>
            <span :style="comStyle" class="iconfont title-icon" @click="showType = !showType">&#xe6eb</span>
            <div :style="marginStyle" class="select-list" v-show="showType" v-for="item in selectType" :key="item.key">
                <div class="select-item" @click="handleSelect(item.key)">{{ item.text }}</div>
            </div>
        </div>
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Trend',
    data() {
        return {
            chart: null,
            allData: null,
            timer: null,
            currentPage: 1,
            totalPage: 1,
            showType: false,
            choiceType: 'map', //选择的数据类型
            titleFontSize: 0
        };
    },
    computed: {
        //下拉列表选项
        selectType() {
            if (!this.allData)
                return [];
            else {
                return this.allData.type.filter(item => item.key !== this.choiceType)
            }

        },
        //显示标题
        showTitle() {
            if (!this.allData)
                return ''
            else
                return this.allData[this.choiceType].title
        },
        // 设置给标题的样式
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px'
            }
        },
        marginStyle() {
            return {
                marginLeft: this.titleFontSize + 'px'
            }
        }
    },
    created() {
        //注册回调函数
        this.$socket.registerCallBack('trendData', this.getData);
    },
    mounted() {
        this.initChart();
        //用websocket发送消息给服务器
        this.$socket.send({
            action: 'getData',
            socketType: 'trendData',
            chartName: 'trend',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    destroyed() {
        //注销回调函数
        this.$socket.unRegisterCallBack('trendData');
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value'
                },
                legend: {
                    left: 20,
                    top: '25%',
                    icon: 'circle',
                },
                grid: {
                    left: '3%',
                    top: '35%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                }
            }
            this.chart.setOption(initOption);
        },
        getData(res) {
            this.allData = res;
            this.updateChart();
        },
        updateChart() {
            // 半透明的颜色值
            const colorArr1 = [
                'rgba(11, 168, 44, 0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
            // 全透明的颜色值
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            let timeArr = this.allData.common.month;
            let valueArr = this.allData[this.choiceType].data;
            let seriesArr = valueArr.map((item, index) => {
                return {
                    type: 'line',
                    name: item.name,
                    data: item.data,
                    stack: 'map',
                    smooth: 'true',
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: colorArr1[index] },
                            { offset: 1, color: colorArr2[index] }
                        ])
                    }
                }
            })
            let legendArr = valueArr.map(item => {
                return item.name
            });
            let dataOption = {
                xAxis: {
                    data: timeArr
                },
                legend: {
                    data: legendArr
                },
                series: seriesArr
            }
            this.chart.setOption(dataOption);
        },
        screenAdapter() {
            this.titleFontSize = this.$refs.chart.offsetWidth / 100 * 3
            let adapterOption = {
                legend: {
                    itemWidth: this.titleFontSize,
                    itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                }
            }
            this.chart.setOption(adapterOption)
            this.chart.resize();
        },
        handleSelect(type) {
            this.choiceType = type;
            this.updateChart();
            this.showType = false;
        }
    },
};
</script>
<style lang="less" scoped>
.title {
    position: absolute;
    left: 20px;
    top: 20px;
    color: #fff;
    z-index: 10;

    .title-icon {
        margin-left: 10px;
        cursor: pointer;
    }

    .select-item {
        cursor: pointer;
    }
}
</style>