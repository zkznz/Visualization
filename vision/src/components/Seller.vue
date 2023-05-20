<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>

export default {
    name: 'Seller',
    data() {
        return {
            chart: null,
            allData: [],
            timer: null,
            currentPage: 1,
            totalPage: 1,
        };
    },
    mounted() {
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
        //页面一加载进行屏幕适配
        this.screenAdapter();
    },
    destroyed() {
        clearInterval(this.timer);
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        //初始化echarts实例
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            //初始化配置
            let initOption = {
                title: {
                    text: '▎商家销售统计',
                    textStyle: {
                        fontSize: 66,
                    },
                    top: 20,
                    left: 20
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '6%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                },
                tooltip: {
                    trigger: 'item',

                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            color: 'white'
                        },
                        itemStyle: {
                            barBorderRadius: [0, 33, 33, 0],
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x1: 1,
                                y: 0,
                                colorStops: [
                                    {
                                        offset: 0, color: '#5052EE' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1, color: '#AB6EE5' // 100% 处的颜色
                                    }
                                ],
                            }
                            // new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            //     //百分之0状态下的颜色值
                            //     {
                            //         offset: 0,
                            //         color: '#5052EE'
                            //     },
                            //     //百分之100状态之下的颜色值
                            //     {
                            //         offset: 1,
                            //         color: '#AB6EE5'
                            //     }
                            // ])
                        }
                    }
                ]
            }
            this.chart.setOption(initOption);
            this.chart.on('mouseover', () => clearInterval(this.timer))
            this.chart.on('mouseout', () => this.startInterval())
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/seller',
                method: 'get'
            })
            this.allData = res;
            this.allData.sort((a, b) => a.value - b.value);
            this.totalPage = res.length % 5 === 0 ? res.length / 5 : Math.ceil(res.length / 5);
            this.updateChart();
            this.startInterval();
        },
        //更新图表
        updateChart() {
            //起始下标
            let start = (this.currentPage - 1) * 5;
            //结束下标
            let end = this.currentPage * 5;
            let showData = this.allData.slice(start, end);
            let sellerNames = showData.map(item => item.name);
            let sellerValue = showData.map(item => item.value);
            //更新数据配置项
            let dataOption = {
                yAxis: {
                    data: sellerNames
                },
                series: [
                    {
                        data: sellerValue,
                    }
                ]
            }
            this.chart.setOption(dataOption);
        },
        startInterval() {
            if (this.timer);
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.currentPage = this.currentPage >= this.totalPage ? 1 : ++this.currentPage;
                this.updateChart();
            }, 3000)
        },
        //图表屏幕适配
        screenAdapter() {
            const titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6;
            let adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize,
                    },
                },
                tooltip: {
                    trigger: 'item',

                },
                series: {
                    itemStyle: {
                        barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
                    }
                }
            }
            this.chart.setOption(adapterOption);
            this.chart.resize();
        }
    },
};
</script>
<style lang="less" scoped></style>