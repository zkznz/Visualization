<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
        <span class="iconfont arr-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
        <span class="iconfont arr-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{ cartName }}</span>
    </div>
</template>

<script>
export default {
    name: 'Hot',
    data() {
        return {
            chart: null,
            allData: null,
            currentIndex: 0, //一级分类下标
            titleFontSize: 0,
        };
    },
    computed: {
        cartName() {
            if (!this.allData)
                return '';
            else
                return this.allData[this.currentIndex].name
        },
        comStyle() {
            return { fontSize: this.titleFontSize + 'px' }
        }
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
                title: {
                    text: '▎ 热销商品的占比',
                    left: 20,
                    top: 20
                },
                legend: {
                    top: '15%',
                    icon: 'circle'
                },
                tooltip: {
                    show: true,
                    formatter(arg) {
                        let sum = 0
                        arg.data.children.forEach(item => {
                            sum += item.value;
                        })
                        let str = ""
                        arg.data.children.forEach(item => {
                            str += `${item.name}:${parseInt(item.value / sum * 100)}%<br/>`
                        })
                        return str;
                    }
                },
                series: [{
                    type: 'pie',
                    top: '15%',
                    label: {
                        show: false,
                        color: 'inherit'
                    },
                    emphasis: {
                        label: {
                            show: true,
                        },
                    }
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
                    children: item.children
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
            this.titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6;
            let adapterOption = {
                title: {
                    textStyle: {
                        fontSize: this.titleFontSize
                    }
                },
                series: {
                    label: {
                        fontSize: this.titleFontSize / 2
                    }
                },
                legend: {
                    itemWidth: this.titleFontSize / 2,
                    itemHeight: this.titleFontSize / 2,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                },
                tooltip: {
                    textStyle: {
                        fontSize: this.titleFontSize / 2.5
                    }
                }
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