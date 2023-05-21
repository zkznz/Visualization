<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
        <span class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
        <span class="cat-name">我是标题</span>
    </div>
</template>

<script>
export default {
    name: 'Hot',
    data() {
        return {
            chart: null,
            allData: [],
            currentIndex: 0, //一级分类下标
        };
    },
    mounted() {
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                series: [{
                    type: 'pie'
                }]
            };
            this.chart.setOption(initOption);
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/hotproduct'
            });
            this.allData = res;
            this.updateChart();
        },
        //更新图表
        updateChart() {
            const legendArr = this.allData[this.currentIndex].children.map(item => item.name);
            const dataArr = this.allData[this.currentIndex].children.map(item => {
                return {
                    name: item.name,
                    value: item.value,
                }
            })
            let dataOption = {
                series: [{
                    data: dataArr
                }],
                legend: {
                    data: legendArr
                }
            };
            this.chart.setOption(dataOption);
        },
        //图表适配
        screenAdapter() {
            let titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6;
            let adapterOption = {

            };
            this.chart.setOption(adapterOption);
            this.chart.resize();
        },
        toLeft() {
            this.currentIndex = this.currentIndex <= 0 ? this.allData.length - 1 : --this.currentIndex;
            this.updateChart();
        },
        toRight() {
            this.currentIndex = this.currentIndex >= this.allData.length - 1 ? 0 : ++this.currentIndex;
            this.updateChart();
        }
    },
};
</script>
<style lang="less" scoped>
.arr-left {
    position: absolute;
    left: 10%;
    top: 50%;
    cursor: pointer;
    color: #fff;
    transform: translateY(-50%);
}

.arr-right {
    position: absolute;
    right: 10%;
    top: 50%;
    cursor: pointer;
    color: #fff;
    transform: translateY(-50%);
}

.cat-name {
    position: absolute;
    left: 80%;
    bottom: 20px;
    color: #fff;
}
</style>